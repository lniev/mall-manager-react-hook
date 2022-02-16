import { LOGIN, FETCHALLRIGHTSLIST } from './constants';
import store from './index';
import { Rights } from 'services/api'
import { message } from 'antd'



export function addRightsList(data) {
	console.log(333)
	return {
		type: 'FETCHALLRIGHTSLIST',
		data: data
	}

}
export function fetchAllRightsList(params) {
	return (dispatch) => {
		dispatch(addRightsList({ status: 'start' }))
		Rights('get', '/tree')
			.then(res => {
				if (res.meta.status !== 200) return
				dispatch(addRightsList({
					status: 'end',
					data: res.data
				}))
			})
			.catch(error => message.error('获取所有权限列表失败，会导致权限管理功能的使用.msg:' + error))
	}
}
