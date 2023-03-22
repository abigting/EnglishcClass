import { Link, Outlet } from 'umi';
import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LearningServices } from '@/services';
// import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';


interface DataType {
    key: React.ReactNode;
    titleName: string;
    userAnswerPath: string;
    userAnswer: string;
    children?: DataType[];
}

interface IProps {
    visible: boolean;
    courseUuid: string;
    closeModal: any
}

export default function Add(props: IProps) {

    const [data, setData] = useState<DataType[]>([]);
    useEffect(() => {
        if (props.visible) {
            getInfo()
        }
    }, [props.visible])


    async function getInfo() {
        const res = await LearningServices.recordList({
            courseUuid: props.courseUuid
        });
        if (res.code === 0) {
            setData(res.data || [])
        }
    }

    const columns: ColumnsType<DataType> = [
        {
            title: '题目名称',
            dataIndex: 'titleName',
            key: 'titleName',
        },
        {
            title: '语音地址',
            dataIndex: 'userAnswerPath',
            width: '30%',
            key: 'userAnswerPath',
            render:(_, record)=><a href={record.userAnswerPath} target="_blank">点击</a>
        },
    ];

    function handleCancel() {
        props.closeModal()
    }

    return (
        <Modal title="答题记录"
            open={props.visible}
            footer={null}
            onCancel={() => handleCancel()}>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </Modal>
    );
}
