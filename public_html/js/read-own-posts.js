/**
 * Binkterm Auto-Read Own Posts Mod
 * https://github.com/thewebexpert/binkterm-php-readOwnPostsMod
 *
 * Automatically marks echo messages authored by the logged-in user as read
 * so your own posts never appear as unread/new with bold text or badge counts.
 */
(function() {
    'use strict';

    // Wait until DOM and jQuery are ready
    function init() {
        if (typeof window.jQuery === 'undefined') {
            setTimeout(init, 50);
            return;
        }

        const $ = window.jQuery;

        /**
         * Resolves the current logged-in user's possible display identities
         * (username, real_name, etc.) in lowercase for case-insensitive matching.
         */
        function getCurrentUserNames() {
            const names = new Set();

            if (window.currentUser) {
                if (window.currentUser.username) {
                    names.add(String(window.currentUser.username).trim().toLowerCase());
                }
                if (window.currentUser.real_name) {
                    names.add(String(window.currentUser.real_name).trim().toLowerCase());
                }
            }

            if (window.currentUserRealName) {
                names.add(String(window.currentUserRealName).trim().toLowerCase());
            }

            return Array.from(names).filter(n => n.length > 0);
        }

        /**
         * Checks whether the given author string belongs to the current logged-in user.
         * Strips any trailing or leading FidoNet node addresses, e.g. "Derek Bird <1:2/3>".
         */
        function isOwnAuthor(fromName) {
            if (!fromName) return false;
            const myNames = getCurrentUserNames();
            if (myNames.length === 0) return false;

            // Strip address part if present: "Name <1:2/3>" -> "Name"
            let cleanName = String(fromName).replace(/<[^>]+>/g, '').trim().toLowerCase();

            for (const name of myNames) {
                if (cleanName === name) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Sends a bulk mark-read request to Binkterm's native API.
         * This updates both `message_read_status` and the `user_echoarea_subscriptions` watermark.
         */
        function markMessagesRead(messageIds, callback) {
            if (!messageIds || messageIds.length === 0) return;

            const intIds = messageIds.map(id => parseInt(id, 10)).filter(id => id > 0);
            if (intIds.length === 0) return;

            $.ajax({
                url: '/api/messages/echomail/read',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ messageIds: intIds }),
                success: function(resp) {
                    if (typeof callback === 'function') {
                        callback(true, resp);
                    }
                },
                error: function(err) {
                    console.warn('[readOwnPostsMod] Failed to mark messages read:', err);
                    if (typeof callback === 'function') {
                        callback(false, err);
                    }
                }
            });
        }

        /**
         * Updates the UI styling for a message row from unread to read.
         */
        function applyReadStyle(messageId) {
            // Check if Binkterm's native helper exists
            if (typeof window.applyEchomailReadStyle === 'function') {
                window.applyEchomailReadStyle(messageId);
                return;
            }

            const row = $(`tr.message-row[data-message-id="${messageId}"], tr.message-row[data-id="${messageId}"]`);
            if (!row.length) return;

            row.removeClass('unread').addClass('read');
            row.find('.fa-envelope')
               .removeClass('fas fa-envelope text-primary')
               .addClass('fas fa-envelope-open text-muted')
               .attr('title', 'Read');
            row.find('.message-subject strong').contents().unwrap();
            row.css('opacity', '0.85');
        }

        // =========================================================================
        // Hook 1: Message List Interception (/echomail, /echomail/{echoarea})
        // =========================================================================
        $(document).ajaxSuccess(function(event, xhr, settings) {
            if (!settings || !settings.url) return;

            // Match GET /api/messages/echomail...
            if (settings.type === 'GET' && settings.url.indexOf('/api/messages/echomail') !== -1) {
                try {
                    const data = xhr.responseJSON;
                    if (!data || !Array.isArray(data.messages)) return;

                    const ownUnreadIds = [];
                    data.messages.forEach(function(msg) {
                        const isRead = (msg.is_read == 1 || msg.is_read === true);
                        if (!isRead && isOwnAuthor(msg.from_name)) {
                            ownUnreadIds.push(msg.id);
                            // Mark in-memory so any subsequent renderers see read status
                            msg.is_read = 1;
                        }
                    });

                    if (ownUnreadIds.length > 0) {
                        // Mark as read in backend
                        markMessagesRead(ownUnreadIds, function(success) {
                            if (success) {
                                ownUnreadIds.forEach(applyReadStyle);
                            }
                        });

                        // Immediately adjust UI rows to prevent visual flicker
                        setTimeout(function() {
                            ownUnreadIds.forEach(applyReadStyle);
                        }, 50);
                    }
                } catch (e) {
                    // Ignore JSON parse errors or non-JSON responses
                }
            }

            // =====================================================================
            // Hook 2: Compose Post Interception (/compose)
            // =====================================================================
            // When sending a new echomail post, intercept the successful send and mark
            // the new message as read in the target echo area before redirection.
            if (settings.type === 'POST' && settings.url.indexOf('/api/messages/send') !== -1) {
                try {
                    let postData = null;
                    if (typeof settings.data === 'string') {
                        postData = JSON.parse(settings.data);
                    } else if (typeof settings.data === 'object') {
                        postData = settings.data;
                    }

                    if (postData && postData.type === 'echomail' && postData.echoarea) {
                        const targetArea = postData.echoarea;
                        const subject = (postData.subject || '').trim();

                        // Query the target area's latest messages
                        const queryUrl = `/api/messages/echomail/${encodeURIComponent(targetArea)}?page=1&sort=desc&limit=5`;
                        $.get(queryUrl).done(function(areaData) {
                            if (areaData && Array.isArray(areaData.messages) && areaData.messages.length > 0) {
                                // Find our newly posted message
                                const matchedMsg = areaData.messages.find(function(m) {
                                    return isOwnAuthor(m.from_name) &&
                                        (!subject || (m.subject || '').trim() === subject);
                                }) || areaData.messages[0]; // fallback to topmost message if exact match ambiguous

                                if (matchedMsg && matchedMsg.id) {
                                    markMessagesRead([matchedMsg.id]);
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.warn('[readOwnPostsMod] Compose interception error:', e);
                }
            }
        });

        // =========================================================================
        // Hook 3: DOM Mutation Observer for dynamically inserted rows
        // =========================================================================
        const container = document.getElementById('messagesContainer');
        if (container) {
            const observer = new MutationObserver(function() {
                $('tr.message-row.unread').each(function() {
                    const row = $(this);
                    const fromText = row.find('.message-from').text() || '';
                    if (isOwnAuthor(fromText)) {
                        const msgId = row.data('message-id') || row.data('id');
                        if (msgId) {
                            markMessagesRead([msgId]);
                            applyReadStyle(msgId);
                        }
                    }
                });
            });

            observer.observe(container, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
