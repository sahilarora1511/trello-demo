export function uuid(){
    return Math.random().toString(16).slice(2)
}

export function saveStatePlugin(store){
    console.log(store)
    store.subscribe(
        (mutations, state) => {
            localStorage.setItem('board', JSON.stringify(state.board))
        }
    )
}
