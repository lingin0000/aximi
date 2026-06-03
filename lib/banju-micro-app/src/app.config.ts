export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/search/search',
    'pages/library/library',
    'pages/poem-detail/poem-detail',
    'pages/my-box/my-box',
    'pages/login/login',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2C5F2D',
    navigationBarTitleText: '半句',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    color: '#A0AEC0',
    selectedColor: '#2C5F2D',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tab-home.png',
        selectedIconPath: 'assets/tab-home-active.png',
      },
      {
        pagePath: 'pages/search/search',
        text: '搜索',
        iconPath: 'assets/tab-search.png',
        selectedIconPath: 'assets/tab-search-active.png',
      },
      {
        pagePath: 'pages/library/library',
        text: '诗库',
        iconPath: 'assets/tab-library.png',
        selectedIconPath: 'assets/tab-library-active.png',
      },
      {
        pagePath: 'pages/my-box/my-box',
        text: '我的',
        iconPath: 'assets/tab-user.png',
        selectedIconPath: 'assets/tab-user-active.png',
      },
    ],
  },
});
