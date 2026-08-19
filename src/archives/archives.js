document.querySelectorAll('.archives tbody tr').forEach(tr => {
    const button = document.createElement('button');
    button.className = 'menu-button';
    button.innerHTML = '&#8942;';
    button.setAttribute('aria-label', 'Options');

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.innerHTML = `
        <button class="menu-item" data-action="view">View</button>
        <button class="menu-item" data-action="delete">Delete</button>
    `;

    const cell = tr.querySelector('td:last-child');
    cell.classList.add('options-cell');
    cell.appendChild(button);
    cell.appendChild(menu);

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = document.querySelector('.menu.open');
        if (open && open !== menu) open.classList.remove('open');
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(item.dataset.action + ': ' + tr.textContent.trim());
            menu.classList.remove('open');
        });
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.menu.open').forEach(m => m.classList.remove('open'));
});