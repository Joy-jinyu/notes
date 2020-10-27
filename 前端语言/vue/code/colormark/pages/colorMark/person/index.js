import PersonProduct from './components/product'
import PersonFans from './components/fans'

import productList from '@/assets/data/products'
import fansList from '@/assets/data/fans'
export default {
    name: 'Person',
    components: {
        // 产品类型的组件
        PersonProduct,
        PersonFans
    },
    data() {
        return {
            // 选中的aside菜单
            activeAside: '',
            // 所有的aside菜单
            asideMenus: [{
                name: '我的关注',
                code: 'focus',
                children: [{
                    name: '动态',
                    code: 'focus-dynamic',
                },
                {
                    name: '关注',
                    code: 'focus-attention',
                },
                {
                    name: '粉丝',
                    code: 'focus-fans',
                }
                ]
            },
            {
                name: '我的创作',
                code: 'create',
                children: [{
                    name: '作品',
                    code: 'create-product',
                },
                {
                    name: '草稿',
                    code: 'create-draft',
                }]
            },
            {
                name: '我的收藏',
                code: 'collection',
                children: [{
                    name: '我的收藏',
                    code: 'collection-index',
                }]
            },
            {
                name: '个人资料',
                code: 'data',
                children: [{
                    name: '基本资料',
                    code: 'data-basic',
                },
                {
                    name: '账户安全',
                    code: 'data-safe',
                }]
            }
            ],
            // 激活的section菜单
            activeSection: '',
            // section的所有菜单项
            sectionMenus: [],
            products: [],
            fansList: [],
            // 展示的组件
            showPage: 'PersonFans',
        };
    },
    created() {
        this.products = productList.splice(0, 9)
        this.fansList = fansList
        this.selectAside(this.asideMenus[0])
    },
    methods: {
        handleSelect() { },
        // 选中aside菜单
        selectAside(menu) {
            this.activeAside = menu.code
            this.sectionMenus = menu.children
            this.selectSection(menu.children[0])
        },
        // 选中了section菜单项目
        selectSection(menu) {
            this.activeSection = menu.code
        },
        vnodeKey(name, index) {
            return name + index++;
        }
    },
};