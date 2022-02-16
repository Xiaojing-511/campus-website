import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";
import {
    Form,
    FormItem,
    Input,
    RadioGroup,
    Radio,
    Button,
    Option,
    Select,
    Message,
    Menu,
    MenuItem,
    Table,
    TableColumn,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Tooltip,
    Dialog
} from 'element-ui';
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Button);
Vue.use(Option);
Vue.use(Select);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Avatar);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.prototype.$message = Message;

