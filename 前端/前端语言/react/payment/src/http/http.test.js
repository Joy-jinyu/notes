// import i18n from '../i18n'

// test("test app", ()=> {
//   const obj = {message_key: "W0018: do not honor"}
//   obj.message_key = obj.message_key.replace("W0018:", "")
//   let cardError = i18n.store?.data[i18n.language]?.translation?.cardError || {};
            
//   if (cardError[obj.message_key]) {//优先用key匹配
//       obj.message = i18n.t('cardError.' + obj.message_key);
//   } else if (cardError[obj.message]) {
//       obj.message = i18n.t('cardError.' + obj.message);
//   }
//   console.log(obj.message)

// })