
import React, { Component} from "react";
import styles from './style.module.scss';
import classNames from 'classnames';
class GiftItem extends Component {
  constructor(props) {
      super();
  }
  
  newOptions= (options)=>{
    if(typeof options==='string'){
      return options
    }else{
      return options.map(option => option.value_name).join(' / ');
    }
  }
  render() {
    const { buyGiftList = [], handleClickShowGift = () => {},t={} } = this.props;
    return (
      <div>
        {
          buyGiftList.map((item,index) => {
            const {image,name,options,price = '',originPrice='',} = item;
            return (
              <div className={styles['buy-gift-product']} key={ index }>
                <div className={styles['left']}>
                  <img src={ image } alt=""/>
                </div>
                <div className={styles['middle']}>
                  <p className={styles['line']}>
                    <span className={styles['tag']}>{ t('GIFT') }</span>
                    <span className={styles['name']}>{ name }</span>
                  </p>
                  <p className={classNames(styles.line,styles['price-line'])}>
                    <span className={styles['options']}>{ this.newOptions(options) }</span>
                    <span className={styles['total-price']}>{ price }</span>
                    <span className={styles['origin-price']}>{ originPrice }</span>
                  </p>
                </div>
                <div className={styles['right']}>
                  {/* <span onClick={ handleClickShowGift }>{ t('View gift') } ></span> */}
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default GiftItem;