import React, { useEffect, useState, useRef } from 'react';
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LearningServices } from '@/services';
import styles from './index.less';
// import { PlusOutlined } from '@ant-design/icons';


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
    const [userRate, setUserRate] = useState<any>();
    const [followReadingPath, setFollowReadingPath] = useState<string>();
    const [playFollowupPath, setPlayFollowupPath] = useState<boolean>();

    const audioRef = useRef<HTMLAudioElement>(null)

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

        const res1 = await LearningServices.courserStat({ courseUuid: props.courseUuid });
        if (res1.code === 0 && res1.data) {
            setUserRate(res1.data)
        }
        const res2 = await LearningServices.answerReadingList({
            courseUuid: props.courseUuid,
            needUser: true
        });
        if (res2.code === 0 && res2.data) {
            if (res2.data[res2.data.length - 1]) {
                setFollowReadingPath(res2.data[res2.data.length - 1].followReadingPath)
            }
            // setUserRate(res1.data)
        }
    }

    const columns: ColumnsType<DataType> = [
        {
            title: '题目名称',
            dataIndex: 'titleName',
            key: 'titleName',
        },
        {
            title: '你的答案',
            dataIndex: 'userAnswer',
            width: '30%',
            key: 'userAnswer',
            render: (_, record) => <span>{record.userAnswer || '-'}</span>
        },
        {
            title: '正确答案',
            dataIndex: 'correctAnswer',
            width: '30%',
            key: 'correctAnswer',
        }
    ];

    function handleCancel() {
        props.closeModal()
    }

    function playFollowupReading() {
        if(playFollowupPath){
            audioRef.current?.pause();
        }else{
            audioRef.current?.play();
        }
        setPlayFollowupPath(!playFollowupPath)
    }

    return (
        <Modal
            title="答题记录"
            open={props.visible}
            footer={null}
            onCancel={() => handleCancel()}>
            <Table
                rowKey={'uuid'}
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: 400 }}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell rowSpan={3} index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell rowSpan={3} index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell rowSpan={3} index={0}>分数：{userRate?.userScore}/{userRate?.allScore}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {
                followReadingPath ?
                    <div className={styles['followup-audio']}>
                        自读功跟读音频:
                        <div className={styles['circle']}  onClick={() => playFollowupReading()}>
                        {
                            playFollowupPath ? <img src={require("@/assets/imgs/lb.gif")} /> : <img src={require("@/assets/imgs/lb.png")} />
                        }
                        </div>
                        <audio ref={audioRef} autoPlay={false} loop={false} src={followReadingPath}></audio>
                    </div> : null
            }
        </Modal>
    );
}
