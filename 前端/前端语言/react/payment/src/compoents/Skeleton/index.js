/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import classNames from "classnames";
import React, { Component } from "react";
import styles from './style.module.scss';
class Index extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    render(props, state) {
        let htmlStr = `<div>
        <style>
            html, body, p {
              margin: 0;
              padding: 0;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            p {
              position: absolute;
            }
          </style><style>
          @keyframes blink {
            0% {
              opacity: .4;
            }
    
            50% {
              opacity: 1;
            }
    
            100% {
              opacity: .4;
            }
          }
          .blink {
            animation-duration: 2s;
            animation-name: blink;
            animation-iteration-count: infinite;
          }
        </style>
          
    <p class="blink" style=" z-index: 0; border-radius: 0% / 0%; background: rgb(238, 238, 238); width: 100%; padding-bottom: 202.029%; margin-top: 0%;"></p>
    <p class="blink" style=" z-index: 1; border-radius: 1.14% / 1.417%; background: rgb(255, 255, 255); width: 93.6%; padding-bottom: 75.275%; left: 3.2%; margin-top: 17.333%;"></p>
    <p class="blink" style="
    z-index: 2;
    background: #EEEEEE;
    width: 32.708%;
    padding-bottom: 3.733%;
    left: 7.467%;
    margin-top: 23.6%;"></p>
    <p class="blink" style="
    z-index: 3;
    border-radius: 50%;
    background: rgb(255, 255, 255);
    width: 4.8%;
    padding-bottom: 4.8%;
    left: 87.733%;
    margin-top: 27.479%;"></p>
    <p class="blink" style="
    z-index: 4;
    background: #EEEEEE;
    width: 32.708%;
    padding-bottom: 3.733%;
    left: 7.467%;
    margin-top: 48.692%;"></p>
    <p class="blink" style="
    z-index: 5;
    border-radius: 50%;
    background: rgb(255, 255, 255);
    width: 4.8%;
    padding-bottom: 4.8%;
    left: 87.733%;
    margin-top: 52.571%;"></p>
    <p class="blink" style="
    z-index: 6;
    background: #EEEEEE;
    width: 32.708%;
    padding-bottom: 3.733%;
    left: 7.467%;
    margin-top: 73.783%;"></p>
    <p class="blink" style="
    z-index: 7;
    border-radius: 50%;
    background: rgb(255, 255, 255);
    width: 4.8%;
    padding-bottom: 4.8%;
    left: 87.733%;
    margin-top: 77.662%;"></p>
    <p class="blink" style="
    z-index: 8;
    background: #EEEEEE;
    width: 34.125%;
    padding-bottom: 3.467%;
    left: 62.675%;
    margin-top: 96.342%;"></p>
    <p class="blink" style="
    z-index: 9;
    border-radius: 1.14% / 2.127%;
    background: rgb(255, 255, 255);
    width: 93.6%;
    padding-bottom: 50.158%;
    left: 3.2%;
    margin-top: 103.658%;"></p>
    <p class="blink" style="
    z-index: 10;
    background: #EEEEEE;
    width: 9.184%;
    padding-bottom: 3.733%;
    left: 7.467%;
    margin-top: 108.858%;"></p>
    <p class="blink" style="
    z-index: 11;
    background: #EEEEEE;
    width: 35.928%;
    padding-bottom: 3.2%;
    left: 35.029%;
    margin-top: 109.392%;"></p>
    <p class="blink" style="
    z-index: 12;
    background: #EEEEEE;
    width: 21.933%;
    padding-bottom: 3.2%;
    left: 7.467%;
    margin-top: 123.95%;"></p>
    <p class="blink" style="
    z-index: 13;
    background: #EEEEEE;
    width: 23.929%;
    padding-bottom: 3.2%;
    left: 7.467%;
    margin-top: 129.283%;"></p>
    <p class="blink" style="
    z-index: 14;
    background: #EEEEEE;
    width: 19.233%;
    padding-bottom: 3.2%;
    left: 7.467%;
    margin-top: 134.617%;"></p>
    <p class="blink" style="
    z-index: 15;
    background: #EEEEEE;
    width: 15.533%;
    padding-bottom: 5.333%;
    left: 75.933%;
    margin-top: 143.15%;"></p>
    <p class="blink" style="
    z-index: 16;
    background: #EEEEEE;
    width: 5.435%;
    padding-bottom: 3.2%;
    left: 47.281%;
    margin-top: 167.15%;"></p>
    <p class="blink" style="
    z-index: 17;
    border-radius: 0% / 0%;
    background: rgb(238, 238, 238);
    width: 100%;
    padding-bottom: 18.133%;
    margin-top: 159.733%;"></p>
    <p class="blink" style="
    z-index: 18;
    border-radius: 28.49% / 208.333%;
    background: #ddd;
    width: 93.6%;
    padding-bottom: 12.8%;
    left: 3.2%;
    margin-top: 161.867%;"></p>
    <p class="blink" style="
    z-index: 19;
    background: #EEEEEE;
    width: 34.546%;
    padding-bottom: 4.267%;
    left: 32.727%;
    margin-top: 166.133%;"></p>
    <p class="blink" style="
    z-index: 0;
    border-radius: 0% / 0%;
    background: rgb(255, 255, 255);
    width: 100%;
    padding-bottom: 12.8%;
    margin-top: 0%;"></p>
    <p class="blink" style="
    z-index: 1;
    border-radius: 0% / 0%;
    background: rgb(239, 239, 239);
    width: 34.667%;
    padding-bottom: 13.067%;
    left: 32.667%;
    margin-top: -0.267%;"></p>
    </div>`;
        const { isMobile } = this.props;
        return isMobile?<div dangerouslySetInnerHTML={{ __html: htmlStr }}></div>:<div className={styles.box}>
            {/* <div className={classNames(styles.headerTopBox)}>
                <div className={classNames(styles.skeletonBox)}>
                    <span className={classNames(styles.skeleton)} style={{ width: 200,height:30 }}></span>
                </div>
            </div>
            <div className={classNames(styles.topBox)}>
                <div className={classNames(styles.skeletonBox)}>
                    <span className={classNames(styles.skeleton)} style={{ width: 100 }}></span>
                </div>
            </div> */}
            <div className={classNames(styles.main)}>
                <div className={styles.left}>
                    <div className={classNames(styles.title, styles.skeletonBox)}>
                        <span className={classNames(styles.skeleton)} style={{ width: 200 }}></span>
                    </div>
                    <ul className={styles.cardBox}>
                        <li className={classNames(styles.skeletonBox)}>
                            <div className={classNames(styles.skeleton)} style={{ width: 100 }}></div>
                            <div className={classNames(styles.skeleton)} style={{ width: 150 }}></div>
                        </li>
                        <li className={classNames(styles.skeletonBox)}>
                            <div className={classNames(styles.skeleton)} style={{ width: 100 }}></div>
                            <div className={classNames(styles.skeleton)} style={{ width: 150 }}></div>
                        </li>
                        <li className={classNames(styles.skeletonBox)}>
                            <div className={classNames(styles.skeleton)} style={{ width: 100 }}></div>
                            <div className={classNames(styles.skeleton)} style={{ width: 150 }}></div>
                        </li>
                    </ul>
                </div>
                <div className={styles.right}>
                    <div className={classNames(styles.title, styles.skeletonBox)}>
                        <span className={classNames(styles.skeleton)} style={{ width: 100 }}></span>
                    </div>
                    <ul className={classNames(styles.cardBox, styles.rightItem)}>
                        <li className={classNames(styles.skeletonBox)}>
                            <div className={classNames(styles.skeleton)} style={{ width: 100 }}></div>
                            <div className={classNames(styles.skeleton)} style={{ width: 150 }}></div>
                        </li>
                        <li className={classNames(styles.skeletonBox)}>
                            <div className={classNames(styles.skeleton)} style={{ width: 120 }}></div>
                            <div className={classNames(styles.skeleton)} style={{ width: 180 }}></div>
                        </li>
                        <li className={classNames(styles.skeletonBox)}>
                            <div className={classNames(styles.skeleton)} style={{ width: 130 }}></div>
                            <div className={classNames(styles.skeleton)} style={{ width: 150 }}></div>
                        </li>
                    </ul>
                    <div className={styles.btnBox}>
                        <div className={styles.btn}>
                            <div className={classNames(styles.text,styles.skeleton)}></div>
                        </div>
                        <div className={classNames(styles.feedback, styles.skeletonBox)}>
                            <span className={classNames(styles.skeleton)} style={{ width: 100 }}></span>
                        </div>
                    </div>
                    <ul className={styles.pci}>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    }
}

export default Index;