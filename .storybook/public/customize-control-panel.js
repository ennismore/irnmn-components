/**
 * Storybook Control Panel Customization
 *
 * - Automatically closes open panel categories (once).
 * - Hides radio switches for CSS var controls.
 * - Allows clicking on variable label to toggle mode.
 */

window.addEventListener('DOMContentLoaded', () => {
    const validStories = ['playground-room-card'];

    const urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('path') || '';
    const isValid = validStories.some((story) => path.includes(story));
    if (!isValid) return;

    let didCollapsePanels = false; // Make sure we only collapse once

    const observer = new MutationObserver(() => {
        const rows = document.querySelectorAll(
            'tbody.docblock-argstable-body tr',
        );

        rows.forEach((row, index) => {
            /**
             * === 1. AUTO-COLLAPSE PANELS (once) ===
             */
            if (!didCollapsePanels) {
                const toggleButton = row.querySelector(
                    'td:first-child > button',
                );
                const isOpen = row.getAttribute('title')?.includes('Hide');
                if (toggleButton && isOpen) {
                    toggleButton.click();
                }
            }

            /**
             * === 2. HIDE SWITCH ROWS + TOGGLE VIA LABEL ===
             */
            const labelSpan = row.querySelector('td:first-child > span');
            if (!labelSpan) return;

            const labelText = labelSpan.innerText.trim();
            if (!labelText.startsWith('🟢') && !labelText.startsWith('🔗'))
                return;
            if (labelSpan.dataset.boundClick) return;

            labelSpan.dataset.boundClick = 'true';
            labelSpan.style.cursor = 'pointer';

            const switchRow = rows[index - 1];
            if (switchRow) {
                switchRow.style.display = 'none';

                labelSpan.addEventListener('click', () => {
                    const customRadio = switchRow.querySelector(
                        'input[type="radio"][value="Custom"]',
                    );
                    const referenceRadio = switchRow.querySelector(
                        'input[type="radio"][value="Reference"]',
                    );
                    if (!customRadio || !referenceRadio) return;

                    const isCustom = customRadio.checked;
                    (isCustom ? referenceRadio : customRadio).click();
                });
            }
        });

        // Mark panel collapsing done after first successful render
        if (!didCollapsePanels) {
            const hasToggles =
                document.querySelectorAll(
                    '.docblock-argstable tr > td:first-child > button',
                ).length > 0;
            if (hasToggles) didCollapsePanels = true;
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
