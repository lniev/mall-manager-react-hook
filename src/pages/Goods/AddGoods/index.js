import React, { useState, useEffect, useRef, useContext } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import { connect } from 'react-redux'
import { Upload, Modal, Form, Input, message, Alert, Steps, Card, Button, Space, Cascader, Result } from 'antd';
import './style.less'
import { PlusOutlined } from '@ant-design/icons';
import { Users, Categories, Goods } from 'services/api';
import { fetchAllRightsList, addRightsList } from 'store/actionCreators'
import Editor from 'react-umeditor'
import { baseURL } from '../../../common/config.json'
import { Provider } from 'react-redux'
import store from 'store'

/**
 * 添加用户界面
 */

function FCAddGoods(props) {
  /**
   * 页面状态和方法
   */
  const [curSteps, setCurSteps] = useState(0) // 当前步骤
  const finishedIndex = useRef(0) // 当前已经完成的步骤
  const [baseInfo, setBaseInfo] = useState({}) // 商品的基本信息
  const [categories, setCategories] = useState([])  // 商品分类
  const [fileList, setFileList] = useState([]) // 图片上床文件列表

  // 获取商品分类
  async function fetchCategories() {
    const { meta, data } = await Categories('get');
    if (meta.status !== 200) return message.error(meta.msg);
    setCategories(data)
  }
  // 获取本地文件base64
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * 页面事件
   */
  // 处理完成基础信息

  function handleBaseInfoFinish(index, values) {
    switch (index) {
      case 0:
        setBaseInfo(values)
        break;
      case 1: break;
      case 2: break;
      case 3: break;
      case 4: break;
    }
    setCurSteps(index + 1)
    if (index > finishedIndex.current) finishedIndex.current = index

  }
  // 处理步骤点击事件
  function handleStepsChange(index) {
    if (finishedIndex.current === 4) return
    index <= finishedIndex.current && setCurSteps(index)
  }

  // 重置基本信息表单
  function restBaseInfo() {
    setBaseInfo({})
    baseInfoForm.resetFields()
  }

  // 完成填写添加商品
  async function handleAllInfoFinish() {
    let pics = fileList.map(el => ({ pic: el.response.data.tmp_path }))

    let query = {
      goods_name: baseInfo.goods_name,
      goods_number: Number(baseInfo.goods_number),
      goods_weight: Number(baseInfo.goods_weight),
      goods_price: Number(baseInfo.goods_price),
      goods_cat: baseInfo.goods_cat.join(','),
      goods_introduc: content,
      pics
    }
    const { meta } = await Goods('post', query)
    if (meta.status !== 201) return message.error(meta.msg)
    handleBaseInfoFinish(4)
  }
  function handleBack() {
    props.history.push('/home/goods')
  }
  function continueAdd() {
    restBaseInfo()
    setCurSteps(0)
    finishedIndex.current = 0
    setFileList([])
    previewData.previewImage = null
    previewData.previewTitle = null
    setContent('')
  }


  // 图片上传
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewData] = useState({})
  async function handlePreview(file) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true)
    previewData.previewImage = file.url || file.preview
    previewData.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
  };
  // 富文本编辑器
  const [content, setContent] = useState('')
  // 富文本编辑器内容改变
  function handleChange(content) {
    setContent(content)
  }

  // const context = useContext(Provider)

  useEffect(() => {
    fetchCategories()

    // console.log(0, Provider)
    console.log(props)
    return () => {
    }
  }, [])

  /**
   * 页面组件相关配置
   */
  // 基础信息表单
  const [baseInfoForm] = Form.useForm();
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 19 },
  };
  // 步骤
  const tabList = ['基本信息', '商品参数', '商品属性', '商品图片', '商品内容', '完成']
  const stepsEleList = tabList.map(el => <Steps.Step title={el} key={el} />)

  // 控制每一个步骤显示隐藏的样式
  const visibleStyle = { visibility: 'visible', position: 'relative' }
  const hiddenStyle = { visibility: 'hidden', position: 'absolute', left: '10000px' }


  // 富文本编辑器 获取u图标
  function getIcons() {
    var icons = [
      "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
      "paragraph fontfamily fontsize | superscript subscript | ",
      "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
      "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
      "horizontal date time  | image emotion spechars | inserttable"
    ]
    return icons;
  }
  // 获取扩展
  function getPlugins() {
    return {
      "image": {
        "uploader": {
          "name": "file",
          "url": baseURL + "upload"
        }
      }
    }
  }

  return (
    <div className="addGoods">
      {/* 面包屑 */}
      <Breadcrumb items={[{ path: '/home/goods', label: '商品列表' }, { path: '/home/goods/addGoods', label: '添加商品' }]} />
      <Card className="content-card">
        <Alert message="添加商品" type="info" showIcon />
        <Steps current={curSteps} className="Steps" onChange={handleStepsChange}>{stepsEleList}</Steps>
        {/* 第一个步骤 */}
        <div className="formContent" style={curSteps === 0 ? visibleStyle : hiddenStyle} key='0'>
          <Form {...layout} form={baseInfoForm} name="baseInfoForm" onFinish={(values) => handleBaseInfoFinish(0, values)}>
            <Form.Item name="goods_name" label="商品名称" required >
              <Input />
            </Form.Item>
            <Form.Item name="goods_price" label="商品价格" required >
              <Input />
            </Form.Item>
            <Form.Item name="goods_weight" label="商品重量" required >
              <Input />
            </Form.Item>
            <Form.Item name="goods_number" label="商品数量" required >
              <Input />
            </Form.Item>
            <Form.Item name="goods_cat" label="商品分类" required >
              <Cascader options={categories} fieldNames={{ label: 'cat_name', value: 'cat_id' }} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Space>
                <Button type="primary" htmlType="submit">下一步</Button>
                <Button htmlType="button" onClick={restBaseInfo}>Reset</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        {/* 第二个步骤 */}
        <div className="formContent" style={curSteps === 1 ? visibleStyle : hiddenStyle} >
          <Button type="primary" onClick={() => handleBaseInfoFinish(1)} >下一步</Button>
        </div>
        {/* 第三个步骤 */}
        <div className="formContent" style={curSteps === 2 ? visibleStyle : hiddenStyle} >
          <Button type="primary" onClick={() => handleBaseInfoFinish(2)} >下一步</Button>
        </div>
        {/* 第四个步骤 */}
        <div className="formContent" style={curSteps === 3 ? visibleStyle : hiddenStyle} >
          <Upload
            action={baseURL + 'upload'}
            listType="picture"
            fileList={fileList}
            headers={{ Authorization: localStorage.getItem('token') }}
            onPreview={handlePreview}
            onChange={({ fileList }) => { setFileList(fileList) }}
          >
            {fileList.length >= 8 ? null : '添加'}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewData.previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            width="50vw"
          >
            <img alt="example" style={{ width: '100%' }} src={previewData.previewImage} />
          </Modal>
          <Button type="primary" onClick={() => handleBaseInfoFinish(3)} >下一步</Button>
        </div>
        {/* 第五步骤 */}
        <div className="formContent" style={curSteps === 4 ? visibleStyle : hiddenStyle} >
          <Editor
            //  ref="editor"
            icons={getIcons()}
            value={content}
            onChange={handleChange}
            plugins={getPlugins()} />
          <Button type="primary" onClick={handleAllInfoFinish} >添加</Button>
        </div>
        {/* 完成 */}
        <div className="formContent" style={curSteps === 5 ? visibleStyle : hiddenStyle} >
          <Result
            status="success"
            title="添加完成"
            extra={[
              <Button key="back" onClick={handleBack}>返回商品列表</Button>,
              <Button key="add" type="primary" onClick={continueAdd}>继续添加</Button>
            ]}
          />,
        </div>

        <button onClick={() => { props.fetch(); console.log(props) }}>fetttt</button>
      </Card>

    </div>
  );
}

const mapStateToProps = (state) => ({ allRightList: state.RightReducer.allRightList })
const mapDispatchToProps = (dispatch) => ({ fetchRightsList: () => dispatch(fetchAllRightsList()) })
export default connect(mapStateToProps, mapDispatchToProps)(FCAddGoods)