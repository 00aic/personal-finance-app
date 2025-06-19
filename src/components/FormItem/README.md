# FormItem 组件

基于 VeeValidate 封装的表单项组件，支持插槽自定义输入内容、自动显示校验错误信息等。

## 📝 说明

基于 Field（来自 VeeValidate）封装。

- ✅ 支持插槽自定义表单控件，如 `<input>`、`<textarea>` 等,也提供默认的 `<input type="text">` 渲染方式。
- ✅ 响应式错误状态样式
- ✅ 自动显示 ErrorMessage。
- ✅ 自动标签关联

## ✅ 用法示例

```vue
<FormItem
  v-model="formData.id"
  name="id"
  label="Street Address"
  placeholder="e.g.Stephen King"
></FormItem>
```

```vue
<FormItem v-model="formData.clientEmail" name="email" label="Street Address" #default="{ field }">
    <input v-bind="field" type="text" id="email" placeholder="e.g.Stephen King" />
</FormItem>
```

## 📌 v-model

| 写法              | 类型      | 默认值 | 说明       |
| ----------------- | --------- | ------ | ---------- |
| `v-model="value"` | `boolean` | —      | 绑定输入值 |

## 🔧 Props

| Prop 名称     | 类型     | 默认值 | 说明                      |
| ------------- | -------- | ------ | ------------------------- |
| `name`        | `string` | —      | 表单字段名                |
| `label`       | `string` | —      | 输入框前的标签，选填      |
| `placeholder` | `string` | —      | 输入框的placeholder，选填 |

## 🧩 插槽 Slots

| 插槽名  | 说明                                                    |
| ------- | ------------------------------------------------------- |
| default | 提供 `field`, `meta`, `errors` 对象，用于自定义输入组件 |

## 版本历史

| 版本  | 变更描述 |
| ----- | -------- |
| 1.0.0 | 初始版本 |
