export const selectStyles = `
    .irnmn-select {
        position: relative;
    }
    .irnmn-select__header {
        padding: 15px;
        font-size: 1rem;
        color: #000;
        background-color: #fff;
        border: 1px solid #000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }
    .irnmn-select__header::after {
        content: '▼';
    }
    .irnmn-select__list {
        display: none;
        position: absolute;
        width: 100%;
        padding: 0;
        margin: 0;
        list-style-type: none;
        background-color: #fff;
        overflow: hidden;
        z-index: 1;
    }
    .irnmn-select__list--open {
        display: block;
        max-height: 400px;
        overflow: auto;
        top: 100%;
        bottom: auto;
    }
    .irnmn-select__list--open.open-upwards {
        top: auto;
        bottom: 100%;
    }
    .irnmn-select__item {
        border: 0;
        padding: 12px 24px;
        cursor: pointer;
    }
    .irnmn-select__item:hover,
    .irnmn-select__item:focus {
        background-color: #eee;
    }
    .irnmn-select__item--unselectable {
        color: #999;
        pointer-events: none;
    }
    .irnmn-select__item[aria-selected="true"] {
        font-weight: bold;
    }
`;