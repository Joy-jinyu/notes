import products from '@/assets/data/products'

export default {
    name: 'Home',
    data () {
        return {
            // 轮播图资源
            swipers: [
                {
                    src: require('@/static/img/space.png')
                }
            ],
            // 副内容板块
            recommends: [
                {
                    src: require('@/static/img/位图_5.png')
                },
                {
                    src: require('@/static/img/位图_6.png')
                },
                {
                    src: require('@/static/img/位图_7.png')
                },
                {
                    src: require('@/static/img/位图_8.png')
                },
                {
                    src: require('@/static/img/位图_9.png')
                }
            ],
            navMenus: [
                '所有领域',
                '平面设计',
                '数字艺术',
                '用户界面',
                '动态图像设计',
                '品牌推广',
                '工业设计',
                '摄影',
                '插画',
                '包装'
            ],
            // nav导航菜单
            activeMenu: '1',
            // nav排序方式
            activeSort: '2',
            products: [],
            space: require('@/static/img/space.png'),
            recommendProducts: [
                {
                    id: 8,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_5.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                },
                {
                    id: 3,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_6.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'wangwu'
                },
                {
                    id: 4,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_7.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                }
            ]
        }
    },
    created () {
        this.products = products
    },
    methods: {
        handleSelect () {},
        vnodeIndex (index) {
            return `${index}`
        },
        vnodeKey (name, index) {
            return name + index++
        }
    }
}
