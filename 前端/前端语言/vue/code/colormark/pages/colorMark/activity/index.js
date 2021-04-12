export default {
    name: 'Activity',
    data () {
        return {
            // 广告位
            space: require('@/static/img/space.png'),
            // 导航菜单
            navMenus: [
                '最新活动',
                '设计大赛',
                '专题策划',
                '线上活动',
                '线下活动'
            ],
            // 导航菜单选中项
            activeMenu: '1',
            activities: [
                {
                    id: 1,
                    title: '摩登上海花————华为全球主题设计大赛插画比赛',
                    startTime: '2020-07-01',
                    endTime: '2020-08-01',
                    time: '3天',
                    views: '1.3k',
                    person: 675,
                    like: 108,
                    contImg: require('@/static/img/activity/activity-1.png')
                },
                {
                    id: 2,
                    title: '《英雄联盟：云顶之弈公开赛》',
                    startTime: '2020-07-01',
                    endTime: '2020-08-01',
                    time: '20天',
                    views: '1.3k',
                    person: 675,
                    like: 108,
                    contImg: require('@/static/img/activity/activity-2.png')
                },
                {
                    id: 3,
                    title: '抗灾疫情，公益招贴设计',
                    startTime: '2020-07-01',
                    endTime: '2020-08-01',
                    time: '3天',
                    views: '1.3k',
                    person: 675,
                    like: 108,
                    contImg: require('@/static/img/activity/activity-3.png')
                },
                {
                    id: 4,
                    title: '第五人格GUI设计',
                    startTime: '2020-07-01',
                    endTime: '2020-08-01',
                    time: '3天',
                    views: '1.3k',
                    person: 675,
                    like: 108,
                    contImg: require('@/static/img/activity/activity-4.png')
                }
            ]
        }
    },
    methods: {
        handleSelect() {},
        vnodeIndex(index) {
            return `${index}`
        },
        vnodeKey (name, index) {
            return name + index++
        }
    }
}
