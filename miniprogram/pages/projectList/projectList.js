// pages/projectList/projectList.js
var mycloud = require('../../utils/cloud.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:-1,  //判别权限标志
    openid:'',
    type: ["招收中", "进行中", "已完成"],
    TabCur: 0,
    scrollLeft: 0,
    projectList: [],
    start: 0
  },

  // 项目类型选择
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      start:0,
      projectList:[]
    },this.getProjectList)
  },

  // 项目列表获取
  getProjectList() {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var handle= res=>{
      console.log(res)
      if(res.data.length!=0)
      {
        this.setData({
          projectList: this.data.projectList.concat(res.data)
        }, () => {
          wx.hideLoading()
        })
      }
      else{
        wx.hideLoading()
        wx.showToast({title:'已经到底了'})
      }
    }
    if(this.data.flag==0) //游客权限
      mycloud.getProjectList(this.data.start, 10, this.data.TabCur, handle)
    else if(this.data.flag==1)  //老师权限
      mycloud.getTeacherProjectList(this.data.openid,this.data.start, 10, this.data.TabCur,handle)
    else if(this.data.flag==2)  //学生权限
      mycloud.getStudentProjectList(this.data.openid,this.data.start, 10, this.data.TabCur,handle)
  },

  //跳转到详情页
  gotoDetail: function (e) {
    console.log(e)
    //addScan
    var index = e.currentTarget.dataset.index
    var scan = "projectList["+index+"].scan"
    mycloud.addScan(e.currentTarget.dataset.id,'projectList',e.currentTarget.dataset.scan,res=>{
      // console.log(res)
      this.setData({[scan]:e.currentTarget.dataset.scan+1})
    })
    //navigate
    wx.navigateTo({
      url: `../projectDetail/projectDetail?id=${e.currentTarget.dataset.id}&type=${this.data.TabCur}&flag=${this.data.flag}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'openid',
      success:res =>{
        console.log(res)
        this.setData({openid:res.data})
      }
    })
    this.setData({start:0,flag:options.flag},this.getProjectList)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({start:this.data.projectList.length})
    this.getProjectList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})