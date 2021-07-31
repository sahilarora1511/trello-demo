import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import Task from './views/Task'

Vue.use(Router)

export default new Router({
    mode:'history',
    base: process.env.BASE_URL,
    routes:[
        {
            path:'/',
            name: 'App',
            component: App,
            children:[
                {
                    path: 'task/:id',
                    name: 'task',
                    component: Task
                }
            ]
        }
    ]
})
