// const versions = async() =>{
//     let {order}=window.shopify_checkouts||{};
//     let {ui_version,uuid}=order||{};
//     switch(ui_version){
//         case 'd':
//             return import('./galaxy_ui/index'); //C版
//         default:
//             return import('./version_c/index'); //Shopify UI
//     }
// }
// versions()
// const load = () => {
//     return import('./version_c/index');
// }
// load();
// require("./galaxy_ui/index");//galaxy_ui
