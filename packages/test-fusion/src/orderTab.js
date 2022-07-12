import { register } from "@lego/core";
import "./orderList";
register({
  type: "orderTab",
  constructor: [
    {
      type: "micloud-page-title",
      options: {
        label: "工单列表",
      },
    },
    {
      type: "micloud-row",
      children: {
        content: {
          type: "micloud-button",
          options: {
            label: "申请工单",
            link: "/add",
          },
        },
      },
      options: {
        children: "@content",
      },
    },
    {
      type: "micloud-tab",
      children: {
        unapprove: [
          {
            type: "orderList",
            options: {
              url: "/api/service/v1/netacl/staging/api/v1/order/approval/list",
            },
          },
        ],
        approving: [
          {
            type: "orderList",
            options: {
              url: "/api/service/v1/netacl/staging/api/v1/order/approval/doing",
            },
          },
        ],
        approved: [
          {
            type: "orderList",
            options: {
              url: "/api/service/v1/netacl/staging/api/v1/order/approved/list",
            },
          },
        ],
        manual: [
          {
            type: "orderList",
            options: {
              url: "/api/service/v1/netacl/staging/api/v1/order/approval/list",
            },
          },
        ],
        searchorder: [
          {
            type: "orderList",
            options: {
              url: "/api/service/v1/netacl/staging/api/v1/order/approval/list",
            },
          },
        ],
      },
      options: {
        tabs: [
          {
            title: "未审批",
            key: "unapprove",
            content: "@unapprove",
          },
          {
            title: "正在审批",
            key: "approving",
            content: "@approving",
          },
          {
            title: "已审批",
            key: "approved",
            content: "@approved",
          },
          {
            title: "手动操作",
            key: "manual",
            content: "@manual",
          },
          {
            title: "搜索工单",
            key: "searchorder",
            content: "@searchorder",
          },
        ],
      },
    },
  ],
});
