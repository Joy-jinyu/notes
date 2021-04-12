export default {
    name: 'User',
    data() {
        return {
            // 选中的菜单
            activeMenu: 'product',
            // 所有的菜单
            menus: [
                {
                    name: '作品',
                    code: 'product'
                },
                {
                    name: '收藏',
                    code: 'collection'
                }
            ],
            // 广告位
            space: require('@/static/img/space.png'),
            products: [
                {
                    id: 1,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_9.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: '张三'
                },
                {
                    id: 2,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_5.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'lisi'
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
                    title: 'APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_7.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                },
                {
                    id: 5,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_8.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                },
                {
                    id: 6,
                    title: 'APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_10.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                },
                {
                    id: 7,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_6.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                },
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
                    id: 9,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_5.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                },
                {
                    id: 10,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_5.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'Ryan'
                },
                {
                    id: 11,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_5.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                },
                {
                    id: 12,
                    title: 'PlayStation APP用户界面重设计 | Redesign',
                    time: '3天前',
                    views: 300,
                    like: 108,
                    contImg: require('@/static/img/位图_5.png'),
                    headImg: require('@/assets/img/person.png'),
                    name: 'zhaoliu'
                }
            ]
        }
    },
    methods: {
        handleSelect() {},
        // 选中菜单
        selectMenu(menu) {
            this.activeMenu = menu.code
        },
        vnodeKey(name, index) {
            return name + index++
        }
    }
}
