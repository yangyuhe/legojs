const { register } = require("@lego/core");

register({
  type: "orderAdd",
  constructor: [
    {
      type: "micloud-page-title",
      options: {
        label: "新增工单",
      },
    },
    {
      type: "micloud-form",
      name: "form",
      triggers: {
        submit: "save.click",
      },
      options: {
        fields: [
          {
            type: "input",
            label: "creator",
            name: "creator",
            value: "${$props.username}",
            hidden: true,
          },
          {
            type: "input",
            label: "acl描述",
            name: "desc",
            rules: [{ required: true }],
          },
          {
            type: "select",
            label: "服务tag",
            name: "tag",
            rules: [{ required: true }],
            options: "${getTags.data}",
          },
        ],
      },
    },
    {
      type: "micloud-ajax",
      name: "getTags",
      options: {
        url: "/api/v1/tools/user/tags",
        params: {
          username: "${$props.username}",
        },
        transform: function (res) {
          return res.tags.map((item) => ({ label: item, value: item }));
        },
      },
    },
    {
      type: "micloud-row",
      refs: {
        content: {
          type: "micloud-button",
          options: {
            label: "新增规则",
          },
        },
      },
      options: {
        children: "@content",
      },
    },
    {
      type: "micloud-table",
      options: {
        columns: [
          {
            title: "ACL类型",
            key: "aclType",
          },
        ],
      },
    },
    {
      type: "micloud-row",
      refs: {
        content: [
          {
            type: "micloud-button",
            name: "save",
            options: {
              label: "保存",
              type: "primary",
            },
          },
          {
            type: "micloud-button",
            options: {
              label: "取消",
              link: "/list",
            },
          },
        ],
      },
      options: {
        children: "@content",
        align: "center",
      },
    },
    {
      type: "micloud-ajax",
      options: {
        immediate: false,
        url: "/api/v1/order/add",
      },
      triggers: {
        request: "form.submit",
      },
    },
  ],
});
