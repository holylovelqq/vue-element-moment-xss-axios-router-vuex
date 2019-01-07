// (C) 2018 SEIKO SOLUTIONS INC.

// 处理timeZone
const timeZone = {
  state: {
    TZone: -(new Date().getTimezoneOffset())
  },
  mutations: {
    tzChange (state, data) {
      state.TZone = data
    }
  },
  actions: {

  }

}
export default timeZone
