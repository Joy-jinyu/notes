/**
 * [Http] axios request Server
 */
declare namespace Http {
    interface Fn {

    }

    interface Method extends Fn {

    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $http: Http.Method
    }
}