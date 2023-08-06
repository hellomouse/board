import { defineStore } from 'pinia';

export const useOptionStore = defineStore({
    id: 'options',
    persist: true,

    state: () => {
        return {
            expand_board_nav: true,
            sort_pins: [],
            sort_boards: [],
            always_show_pin_details: false
        };
    }
});
