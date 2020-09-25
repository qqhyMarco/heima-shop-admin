import Vue from "vue";
import {
  Button,
  Form,
  FormItem,
  input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  card,
  row,
  col,
  table,
  tableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox 

} from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(card);
Vue.use(row);
Vue.use(col);
Vue.use(table);
Vue.use(tableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm
