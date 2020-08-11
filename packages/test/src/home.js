export default [
  {
    type: "sidebar-layout",
    refs: {
      content: {
        type: "cloud-route",
        refs: {
          home: {
            type: "antd-button",
            options: {
              text: "hello",
            },
          },
        },
        options: {
          configs: [
            {
              path: "/home/index",
              component: "@home",
            },
            {
              path: "/home/analyse",
              component: "分析",
            },
          ],
        },
      },
    },
    options: {
      menus: [
        {
          name: "首页",
          url: "/home/index",
          icon: "PieChartOutlined",
        },
        {
          name: "分析",
          url: "/home/analyse",
          icon: "BarChartOutlined",
        },
      ],
      hash: false,
      content: "@content",
      logo: "//s02.mifile.cn/assets/static/image/mi-logo.png",
      logoBgColor: "#ff6700",
    },
  },
  {
    type: "cloud-userinfo",
    states: {
      userinfo: "userinfo",
    },
  },
];
