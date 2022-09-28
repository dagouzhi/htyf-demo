import React, { useEffect, useState } from 'react';
import sdk from '@hongtangyun/rooms-sdk';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {Button, Form, Input, InputNumber, Space} from 'antd'
import useAgora from '@/utils/AgoraRTC/hooks/useAgora';
import MediaPlayer from '@/utils/AgoraRTC/components/MediaPlayer';
import './Call.css';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function Call() {
  const [form] = Form.useForm();
  const {
    localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers
  } = useAgora(client);

  const createWebRTCRoom = async (token: string) => {
    await sdk.config({
      // 房间用户的token
      token: token,
    });
    const roomData = await sdk.getRoomInfo()
    const rtcInfo = await sdk.createWebRTCRoom('test_room');
    form.setFieldsValue({
      appid: rtcInfo?.appid,
      token: rtcInfo?.token,
      channel: rtcInfo?.channel,
      uid: rtcInfo?.uid,
    })
  }

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className='call'>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="userToken" label="userToken" rules={[{ required: true }]}>
          <Input placeholder='请输入userToken' addonAfter={<Button size="small" onClick={() => {
            form.validateFields(['userToken'])
            const userToken = form.getFieldValue('userToken')
            if (userToken) {
              createWebRTCRoom(userToken);
            }
          }}>确定</Button>} />
        </Form.Item>
        <Form.Item name="appid" label="appid" rules={[{ required: true }]}>
          <Input disabled placeholder='请输入appid' />
        </Form.Item>
        <Form.Item name="token" label="token" rules={[{ required: true }]}>
          <Input disabled placeholder='请输入token' />
        </Form.Item>
        <Form.Item name="channel" label="channel" rules={[{ required: true }]}>
          <Input disabled placeholder='请输入channel' />
        </Form.Item>
        <Form.Item name="uid" label="uid" rules={[{ required: true }]}>
          <Input disabled placeholder='请输入uid' />
        </Form.Item>
        <div className='button-group'>
          <Button id='join' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {
            form.validateFields(['userToken', 'appid', 'token', 'channel', 'uid'])
            const values = form.getFieldsValue()
            if (values.appid) {
              join(values.appid, values.channel, values.token, values.uid)
            }
          }}>
            加入房间
          </Button>
          <Button id='leave' className='btn btn-primary btn-sm' disabled={!joinState} onClick={() => {leave()}}>
            离开房间
          </Button>
        </div>
      </Form>
      <div className='player-container'>
        <div className='local-player-wrapper'>
          <p className='local-player-text'>{localVideoTrack && `localTrack`}{joinState && localVideoTrack ? `(${client.uid})` : ''}</p>
          <MediaPlayer videoTrack={localVideoTrack} audioTrack={localAudioTrack}></MediaPlayer>
        </div>
        {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
            <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
            <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
          </div>))}
      </div>
    </div>
  );
}

export default Call;
