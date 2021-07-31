<template>
  <div class="board">
    <div class="page">
      <div class="column" v-for="(column,$columnIndex) in board.columns" :key="$columnIndex" @drop="moveTask($event, column.tasks)" @dragover.prevent @dragenter.prevent>
        <div class="name">
          {{column.name}}
        </div>
      <div class="list-rest">
        <div class="task" v-for="(task, $taskIndex) in column.tasks" :key="$taskIndex" @click="openModal(task)" draggable @dragstart="pickUpTask($event, $taskIndex, $columnIndex)">
            <span class="task-name">{{task.name}}</span>
            <span class="task-description" v-if="task.description">{{task.description}}</span>
        </div>
      </div>

        <input class="inputText" type="text" placeholder="+ Add a card (type then press enter)"  @keyup.enter="createTask($event,column.tasks)"/>
      </div>

      <div class="column">
        <input class="inputText" type="text" placeholder="+ Add a new list (type then press enter)" v-model="newColumnName" @keyup.enter="createColumn()"/>
      </div>

    </div>

<!--   Modal- visible after clicking tasks -->
    <div id="myModal" class="modal" v-show="isTaskOpen" @click.self="closeModal()">
      <!-- Modal content -->
      <div class="modal-content">
        <span class="close" @click="closeModal()">&times;</span>
        <span class="taskNameModal"><input :value="this.taskName" @change="updateTaskProperty($event,'name')" /></span>
        <span class="textarea"><textarea :value="this.description" @change="updateTaskProperty($event,'description')"></textarea></span>
      </div>

    </div>
<!--    -->

  </div>
</template>

<script>

import {mapState} from 'vuex';
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  data(){
    return{
      description:"",
      taskName:"",
      newColumnName: ""
    }
  },
  computed: {
    ...mapState(['board']),
    ...mapGetters(['getTaskStore']),
    isTaskOpen(){
      return this.$route.name === 'task'
    },
    task(){
      return this.getTaskStore(this.$route.params.id)
    }
  },
  methods:{
    getTask(){
      let id = this.$route.params.id;
        for(let column in this.board.columns){
          for(let task in this.board.columns[column].tasks){
            if(this.board.columns[column].tasks[task].id == id){
              this.description = this.board.columns[column].tasks[task].description;
              this.taskName = this.board.columns[column].tasks[task].name;
            }
          }
        }
    },

    getTaskById(task){
      this.$router.push({name:'task', params:{id:task.id}});
      this.getTask()
    },

    openModal(task){
      this.getTaskById(task);
    },

    closeModal(){
      this.$router.push({name:'/'})
    },

    createTask(e,tasks){
      this.$store.commit('CREATE_TASK',{
        tasks,
        name: e.target.value
      });
      e.target.value="";
    },

    updateTaskProperty(e, key){
      this.$store.commit('UPDATE_TASK',{
          task : this.task,
          key,
          value : e.target.value
      })
      if(key==='name'){
        this.taskName = e.target.value
      }
      else{
        this.description = e.target.value
      }
    },

    pickUpTask(e, taskIndex, fromColumnIndex){
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('task-index', taskIndex)
      e.dataTransfer.setData('from-column-index', fromColumnIndex)
    },

    moveTask(e, toTasks){
      const fromColumnIndex = e.dataTransfer.getData('from-column-index')
      const fromTasks = this.board.columns[fromColumnIndex].tasks;
      const taskIndex = e.dataTransfer.getData('task-index')

      this.$store.commit('MOVE_TASK',{
          fromTasks,
          toTasks,
          taskIndex
      })
    },

    createColumn(){
      this.$store.commit('CREATE_COLUMN', {
        name: this.newColumnName
      })
      this.newColumnName = '';
    }

  }
}
</script>

<style>
.board {
  margin: 20px;
}

.page{
  display: flex;
}

.task:hover{
  cursor:pointer;
}

.column {
  display: block;
  min-width: 320px;
  max-width: 320px;
  margin-right: 40px;
  background-color: lightgrey;
  border-radius: 6px;
  overflow: auto;
  height: 100%;
}

.name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
  margin-left: 10px;
  margin-top: 4px;
}

.task {
  background-color: white;
  margin: 10px;
  padding: 10px;
  border-radius: 9px;
}

span.task-name {
  font-weight: 500;
  font-size: 18px;
}

span.task-description {
  margin-top: 5px;
  display: block;
  font-size:14px
}

/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
  height: 30%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

span.textarea textarea {
  width: 100%;
  min-height: 50%;
}

.inputText {
  border: none;
  background-color: white;
  margin: 10px;
  padding: 10px;
  border-radius: 9px;
  width: 80%;
}

.taskNameModal input {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  width: 90%;
  padding: 10px 8px;
  border: 0.5px solid #ddd;
  border-radius: 6px;
}

</style>
