/**
 * ============================================================================
 * Binkterm File Area Button & Directory Mod
 * Quick Network Filters & Network Directory Landing View on /files
 * https://github.com/thewebexpert/binkterm-php-fileButtonMod
 * ============================================================================
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'binkterm_file_filter_network';

    function getSavedFileNetwork() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const netParam = urlParams.get('net');
            if (netParam) {
                return netParam.toLowerCase();
            }
            if (window.UserStorage && typeof window.UserStorage.getItem === 'function') {
                const userVal = window.UserStorage.getItem('file_filter_network');
                if (userVal) {
                    return userVal.toLowerCase();
                }
            }
            const localVal = localStorage.getItem(STORAGE_KEY);
            if (localVal) {
                return localVal.toLowerCase();
            }
        } catch (e) {}
        return 'all';
    }

    function setSavedFileNetwork(net) {
        try {
            if (window.UserStorage && typeof window.UserStorage.setItem === 'function') {
                window.UserStorage.setItem('file_filter_network', net);
            }
            localStorage.setItem(STORAGE_KEY, net);

            const url = new URL(window.location);
            if (!net || net === 'all') {
                url.searchParams.delete('net');
            } else {
                url.searchParams.set('net', net);
            }
            window.history.replaceState({}, '', url);
        } catch (e) {}
    }

    function initFileButtonMod() {
        // Only run on the files pages (/files, /files/...)
        const filesContainer = document.getElementById('filesContainer');
        if (!filesContainer) {
            return;
        }

        // Avoid duplicate initialization
        if (document.getElementById('file-button-toolbar')) {
            return;
        }

        const mainRow = document.querySelector('.row:has(#filesContainer)') || filesContainer.closest('.row');
        if (!mainRow) {
            return;
        }

        // 1. Create the Toolbar Container directly above the main row
        const toolbar = document.createElement('div');
        toolbar.id = 'file-button-toolbar';
        toolbar.className = 'file-button-toolbar';

        toolbar.innerHTML = `
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                <div class="file-section-title mb-0">
                    <span><i class="fas fa-network-wired me-1"></i> Quick Network Filters</span>
                    <span class="badge bg-secondary ms-2" id="file-badge-total">-</span>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-primary file-btn file-action-btn active" id="file-btn-directory">
                        <i class="fas fa-th-large me-1"></i> Area Directory
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary file-btn file-action-btn" id="file-btn-recent">
                        <i class="fas fa-clock me-1"></i> Recent Uploads
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-warning file-btn file-action-btn d-none" id="file-btn-back">
                        <i class="fas fa-arrow-left me-1"></i> Back to Directory
                    </button>
                </div>
            </div>
            <div class="file-btn-group" id="file-network-buttons">
                <button type="button" class="btn btn-sm btn-primary active file-btn" data-net="all">
                    <i class="fas fa-border-all me-1"></i> ALL
                </button>
            </div>
        `;

        mainRow.parentNode.insertBefore(toolbar, mainRow);

        // 2. Create the Directory Grid Container inside the main col-lg-9 panel
        const mainCard = filesContainer.closest('.card');
        const directoryContainer = document.createElement('div');
        directoryContainer.id = 'filesDirectoryContainer';
        directoryContainer.className = 'd-none';

        if (mainCard && mainCard.parentNode) {
            mainCard.parentNode.insertBefore(directoryContainer, mainCard);
        }

        let activeNetwork = getSavedFileNetwork();
        let currentMode = 'directory'; // 'directory' or 'area' or 'recent'

        // Wait for allFileAreas to be populated by Binkterm's files.twig
        let pollCount = 0;
        function populateWhenReady() {
            if (typeof allFileAreas !== 'undefined' && Array.isArray(allFileAreas) && allFileAreas.length > 0) {
                renderNetworkButtons(allFileAreas);
                renderDirectoryView(allFileAreas);

                // Determine initial view:
                // If the user accessed /files with a specific tag (e.g. /files/TAG or ?area=),
                // respect Binkterm's selection and show the area files.
                // Otherwise, show the Area Directory with active saved network!
                const pathMatches = window.location.pathname.match(/^\/files\/([^\/?#]+)$/);
                const urlParams = new URLSearchParams(window.location.search);
                const hasAreaInUrl = (pathMatches && pathMatches[1]) || urlParams.get('area') || urlParams.get('view') === 'my-uploads';

                if (hasAreaInUrl) {
                    showAreaFilesMode();
                } else {
                    showDirectoryMode(activeNetwork, false);
                }
            } else if (pollCount < 40) { // 4 seconds max
                pollCount++;
                setTimeout(populateWhenReady, 100);
            }
        }

        populateWhenReady();

        // =========================================================================
        // Render Network Filter Buttons
        // =========================================================================
        function renderNetworkButtons(areas) {
            const counts = {};
            let total = 0;

            areas.forEach(function (area) {
                let net = 'unknown';
                if (area.is_local) {
                    net = 'local';
                } else if (area.domain) {
                    net = area.domain.toLowerCase();
                }

                counts[net] = (counts[net] || 0) + 1;
                total++;
            });

            // Update total badge
            const totalBadge = document.getElementById('file-badge-total');
            if (totalBadge) {
                totalBadge.textContent = `${total} area${total !== 1 ? 's' : ''}`;
            }

            const btnContainer = document.getElementById('file-network-buttons');
            if (!btnContainer) return;

            let html = `
                <button type="button" class="btn btn-sm ${activeNetwork === 'all' ? 'btn-primary active' : 'btn-outline-secondary'} file-btn" data-net="all">
                    <i class="fas fa-border-all me-1"></i> ALL <span class="badge bg-secondary ms-1">${total}</span>
                </button>
            `;

            // Local first
            if (counts['local']) {
                const isActive = activeNetwork === 'local';
                html += `
                    <button type="button" class="btn btn-sm ${isActive ? 'btn-primary active' : 'btn-outline-secondary'} file-btn" data-net="local">
                        <i class="fas fa-home me-1 text-success"></i> LOCAL <span class="badge bg-secondary ms-1">${counts['local']}</span>
                    </button>
                `;
                delete counts['local'];
            }

            // Lovlynet second
            if (counts['lovlynet']) {
                const isActive = activeNetwork === 'lovlynet';
                html += `
                    <button type="button" class="btn btn-sm ${isActive ? 'btn-primary active' : 'btn-outline-secondary'} file-btn" data-net="lovlynet">
                        <i class="fas fa-heart me-1 text-danger"></i> LOVLYNET <span class="badge bg-secondary ms-1">${counts['lovlynet']}</span>
                    </button>
                `;
                delete counts['lovlynet'];
            }

            // Other networks alphabetically
            Object.keys(counts).sort().forEach(function (net) {
                const count = counts[net];
                const isActive = activeNetwork === net;
                html += `
                    <button type="button" class="btn btn-sm ${isActive ? 'btn-primary active' : 'btn-outline-secondary'} file-btn" data-net="${net}">
                        <i class="fas fa-network-wired me-1 text-info"></i> ${net.toUpperCase()} <span class="badge bg-secondary ms-1">${count}</span>
                    </button>
                `;
            });

            // Special user buttons if available
            if (typeof currentUserId !== 'undefined' && currentUserId !== null) {
                if (typeof privateFileArea !== 'undefined' && privateFileArea) {
                    html += `
                        <button type="button" class="btn btn-sm btn-outline-secondary file-btn" id="file-btn-myfiles">
                            <i class="fas fa-user-circle me-1 text-primary"></i> MY FILES
                        </button>
                    `;
                }
                html += `
                    <button type="button" class="btn btn-sm btn-outline-secondary file-btn" id="file-btn-myuploads">
                        <i class="fas fa-upload me-1 text-info"></i> MY UPLOADS
                    </button>
                `;
            }

            btnContainer.innerHTML = html;

            // Bind click handlers to network filter buttons
            btnContainer.querySelectorAll('.file-btn[data-net]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const net = this.getAttribute('data-net');
                    showDirectoryMode(net);
                });
            });

            const myFilesBtn = document.getElementById('file-btn-myfiles');
            if (myFilesBtn && typeof privateFileArea !== 'undefined' && privateFileArea) {
                myFilesBtn.addEventListener('click', function() {
                    if (typeof selectFileArea === 'function') {
                        selectFileArea(privateFileArea.id);
                        showAreaFilesMode();
                    }
                });
            }

            const myUploadsBtn = document.getElementById('file-btn-myuploads');
            if (myUploadsBtn) {
                myUploadsBtn.addEventListener('click', function() {
                    if (typeof selectMyUploads === 'function') {
                        selectMyUploads();
                        showAreaFilesMode();
                    }
                });
            }
        }

        // =========================================================================
        // Render Directory Landing View (Matching /echolist)
        // =========================================================================
        function renderDirectoryView(areas) {
            const publicAreas = areas.filter(a => typeof privateFileArea === 'undefined' || !privateFileArea || a.id !== privateFileArea.id);

            // Group by network
            const localLabel = 'local';
            const groups = { [localLabel]: [] };

            publicAreas.forEach(function (area) {
                if (area.is_local) {
                    groups[localLabel].push(area);
                } else {
                    const net = (area.domain || 'unknown').toLowerCase();
                    if (!groups[net]) groups[net] = [];
                    groups[net].push(area);
                }
            });

            let html = '';

            // Local first
            if (groups[localLabel] && groups[localLabel].length > 0) {
                html += buildNetworkCard('local', 'Local Areas', groups[localLabel], true);
                delete groups[localLabel];
            }

            // Lovlynet second
            if (groups['lovlynet'] && groups['lovlynet'].length > 0) {
                html += buildNetworkCard('lovlynet', 'LOVLYNET Network', groups['lovlynet'], false);
                delete groups['lovlynet'];
            }

            // Other networks alphabetically
            Object.keys(groups).sort().forEach(function (net) {
                if (groups[net].length > 0) {
                    html += buildNetworkCard(net, net.toUpperCase() + ' Network', groups[net], false);
                }
            });

            directoryContainer.innerHTML = html;

            // Bind click handlers to area cards
            directoryContainer.querySelectorAll('.filearea-row-link').forEach(function (link) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const areaId = parseInt(this.getAttribute('data-area-id'), 10);
                    if (areaId && typeof selectFileArea === 'function') {
                        selectFileArea(areaId);
                        showAreaFilesMode();
                    }
                });
            });
        }

        function buildNetworkCard(netId, title, areas, isLocal) {
            const badgeColor = isLocal ? 'bg-success' : 'bg-primary';
            const totalFiles = areas.reduce((sum, a) => sum + (parseInt(a.file_count, 10) || 0), 0);
            const totalBytes = areas.reduce((sum, a) => sum + (parseInt(a.total_size, 10) || 0), 0);
            const sizeStr = typeof formatBytes === 'function' ? formatBytes(totalBytes) : `${Math.round(totalBytes / 1024)} KB`;

            let html = `
                <div class="card mb-3 file-network-card" data-network="${netId}">
                    <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h6 class="mb-0"><i class="fas fa-folder me-2 text-warning"></i>${escapeHtml(title)}</h6>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge ${badgeColor}">${areas.length} area${areas.length !== 1 ? 's' : ''}</span>
                            <span class="badge bg-secondary">${totalFiles} files · ${sizeStr}</span>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush">
            `;

            areas.forEach(function (area) {
                const fileCount = area.file_count || 0;
                const areaSize = typeof formatBytes === 'function' ? formatBytes(area.total_size || 0) : `${area.total_size || 0} bytes`;
                const isAreaLocal = !!area.is_local;
                const domain = area.domain || '';

                let displayTag = escapeHtml(area.tag);
                if (!isAreaLocal && domain) {
                    displayTag += `<span class="text-muted small">@${escapeHtml(domain)}</span>`;
                }

                let badges = '';
                if (area.gemini_public) {
                    badges += `<span class="badge text-bg-info me-1" style="font-size:0.7em;"><i class="fas fa-gem"></i> Gemini</span>`;
                }
                if (area.freq_enabled) {
                    badges += `<span class="badge text-bg-warning me-1" style="font-size:0.7em;"><i class="fas fa-file-download"></i> FREQ</span>`;
                }
                if (area.upload_permission === 1) {
                    badges += `<span class="badge text-bg-success me-1" style="font-size:0.7em;"><i class="fas fa-upload"></i> Uploads</span>`;
                }

                html += `
                    <li class="list-group-item p-0">
                        <a href="#" class="filearea-row-link p-3 d-block" data-area-id="${area.id}">
                            <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                <div class="d-flex align-items-center gap-3" style="min-width:0; flex:1 1 60%;">
                                    <div class="filearea-icon" style="background-color: ${isAreaLocal ? '#198754' : '#0d6efd'};">
                                        <i class="fas fa-folder-open"></i>
                                    </div>
                                    <div style="min-width:0;">
                                        <div class="filearea-title">${displayTag}</div>
                                        <div class="filearea-desc">${escapeHtml(area.description || 'No description available')}</div>
                                    </div>
                                </div>
                                <div class="filearea-stats">
                                    <div class="mb-1">${badges}</div>
                                    <span class="badge bg-secondary me-1">${fileCount} files</span>
                                    <span class="badge bg-dark">${areaSize}</span>
                                </div>
                            </div>
                        </a>
                    </li>
                `;
            });

            html += `
                    </ul>
                </div>
            `;

            return html;
        }

        // =========================================================================
        // View Modes & Navigation
        // =========================================================================
        function showDirectoryMode(net, savePref = true) {
            currentMode = 'directory';
            activeNetwork = net || 'all';

            if (savePref) {
                setSavedFileNetwork(activeNetwork);
            }

            // Show directory container, hide file files table
            if (mainCard) mainCard.classList.add('d-none');
            directoryContainer.classList.remove('d-none');

            // Filter network cards
            const cards = directoryContainer.querySelectorAll('.file-network-card');
            cards.forEach(function (card) {
                const cardNet = card.getAttribute('data-network');
                if (activeNetwork === 'all' || cardNet === activeNetwork) {
                    card.classList.remove('d-none');
                } else {
                    card.classList.add('d-none');
                }
            });

            // Update toolbar button states
            updateToolbarStates('directory', activeNetwork);
        }

        function showAreaFilesMode() {
            currentMode = 'area';

            // Show files table, hide directory
            directoryContainer.classList.add('d-none');
            if (mainCard) mainCard.classList.remove('d-none');

            updateToolbarStates('area', null);
        }

        function showRecentMode() {
            currentMode = 'recent';

            directoryContainer.classList.add('d-none');
            if (mainCard) mainCard.classList.remove('d-none');

            if (typeof loadRecentFiles === 'function') {
                loadRecentFiles();
            }

            updateToolbarStates('recent', null);
        }

        function updateToolbarStates(mode, net) {
            const dirBtn = document.getElementById('file-btn-directory');
            const recentBtn = document.getElementById('file-btn-recent');
            const backBtn = document.getElementById('file-btn-back');

            if (dirBtn) {
                if (mode === 'directory') {
                    dirBtn.classList.remove('btn-outline-secondary');
                    dirBtn.classList.add('btn-primary', 'active');
                } else {
                    dirBtn.classList.remove('btn-primary', 'active');
                    dirBtn.classList.add('btn-outline-secondary');
                }
            }

            if (recentBtn) {
                if (mode === 'recent') {
                    recentBtn.classList.remove('btn-outline-secondary');
                    recentBtn.classList.add('btn-primary', 'active');
                } else {
                    recentBtn.classList.remove('btn-primary', 'active');
                    recentBtn.classList.add('btn-outline-secondary');
                }
            }

            if (backBtn) {
                if (mode === 'area' || mode === 'recent') {
                    backBtn.classList.remove('d-none');
                } else {
                    backBtn.classList.add('d-none');
                }
            }

            // Update network buttons active class
            document.querySelectorAll('#file-network-buttons .file-btn[data-net]').forEach(function (btn) {
                const bNet = btn.getAttribute('data-net');
                if (mode === 'directory' && bNet === (net || 'all')) {
                    btn.classList.remove('btn-outline-secondary');
                    btn.classList.add('btn-primary', 'active');
                } else {
                    btn.classList.remove('btn-primary', 'active');
                    btn.classList.add('btn-outline-secondary');
                }
            });
        }

        // Toolbar top-right action button events
        const dirBtn = document.getElementById('file-btn-directory');
        if (dirBtn) {
            dirBtn.addEventListener('click', function () {
                showDirectoryMode('all');
            });
        }

        const recentBtn = document.getElementById('file-btn-recent');
        if (recentBtn) {
            recentBtn.addEventListener('click', function () {
                showRecentMode();
            });
        }

        const backBtn = document.getElementById('file-btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', function () {
                showDirectoryMode(activeNetwork, false);
            });
        }

        // Listen for browser Back/Forward navigation
        window.addEventListener('popstate', function () {
            const currentSaved = getSavedFileNetwork();
            if (currentSaved !== activeNetwork && currentMode === 'directory') {
                showDirectoryMode(currentSaved, false);
            }
        });

        // Wrap or intercept selectFileArea from sidebar list-group
        const sidebarList = document.getElementById('fileAreasList');
        if (sidebarList) {
            sidebarList.addEventListener('click', function (e) {
                const item = e.target.closest('.list-group-item[data-area-id]');
                if (item) {
                    showAreaFilesMode();
                }
            });
        }

        function escapeHtml(text) {
            if (!text) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFileButtonMod);
    } else {
        initFileButtonMod();
    }
})();
