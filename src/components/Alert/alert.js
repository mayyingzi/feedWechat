import { mapGetters } from 'vuex';
import buttonHandlers from './buttonHandlers';

export default {
    name: 'Alert',
    props: {
        message: {
            type: String,
            required: true,
        },
        buttons: Number,
        leftBtn: Object,
        rightBtn: Object,
        singleBtn: Object,
    },
    computed: {
        ...mapGetters(['alertOpts']),
        show() {
            return !!this.alertOpts.message;
        },
    },
    methods: {
        btnHandler(target) {
            const { handler, params = null } = this[`${target}Btn`];
            buttonHandlers[handler](params);
        },
    },
};
