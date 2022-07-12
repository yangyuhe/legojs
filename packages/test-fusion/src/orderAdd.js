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
            value: "${$global.root.username}",
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
            options:
              "${getTags.data.tags.map((item) => ({ label: item, value: item }))}",
          },
        ],
      },
    },
    {
      type: "micloud-ajax",
      name: "getTags",
      options: {
        url: "/api/service/v1/netacl/staging/api/v1/tools/user/tags",
        params: {
          username: "${$global.root.userinfo.name}",
        },
      },
    },
    {
      type: "micloud-row",
      children: {
        content: {
          type: "micloud-button",
          name: "addRuleBtn",
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
      type: "micloud-modal",
      children: {
        form: {
          type: "micloud-form",
          options: {
            fields: [
              {
                label: "ACL类型",
                name: "aclType",
                type: "select",
                options: "${getAclTypes.data.acl_type}",
              },
              {
                label: "业务类型",
                name: "business_area",
                type: "select",
                options: "${}",
              },
            ],
          },
        },
      },
      options: {
        title: "添加规则",
        content: "@form",
      },
      triggers: {
        show: "addRuleBtn.click",
      },
    },
    {
      type: "micloud-row",
      children: {
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
        url: "/api/service/v1/netacl/staging/api/v1/order/add",
      },
      triggers: {
        request: "form.submit",
      },
    },
    {
      type: "micloud-ajax",
      name: "getAclTypes",
      options: {
        url: "/api/service/v1/netacl/staging/api/v1/order/acltype",
      },
    },
    {
      type: "micloud-ajax",
      name: "",
      options: {
        url: "/api/service/v1/netacl/staging/api/v1/order/businessarea",
        params: {
          acltype: "",
        },
      },
    },
  ],
});
