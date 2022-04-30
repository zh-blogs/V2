import React from 'react';
import {
  Popconfirm,
  Button as AntdButton,
  ButtonProps as AntdButtonProps,
  Modal,
  ModalProps as AntdModalProps,
} from 'antd';
import { Combine } from '@/utils/types';

export declare type ModalProps = Combine<{ content: React.ReactNode }, AntdModalProps>

export function ModalInfo(props: ModalProps) {
  const { content, ...restProps } = props;
  
  return Modal.info({
    width: "90vw",
    centered: true,
    maskClosable: true,
    closable: true,
    okButtonProps: { style: { display: "none" } },
    ...restProps,
    content: <div style={{ width: "100%", maxHeight: "85vh", overflow: "auto" }}>{content}</div>
      
  });
}

export declare type ButtonProps = Combine<{
    text?: React.ReactNode,
    confirm?: React.ReactNode,
    modalProps?: ModalProps,
    disabled?: boolean,
    onClick?:()=>void,
}, AntdButtonProps>

export function Button(props:ButtonProps) {
  var { text, confirm = '', onClick, modalProps, disabled = false, children, ...restProps } = props;
    
  const _onClick = React.useMemo(() =>
    !!modalProps ?( () => ModalInfo(modalProps as ModalProps)) : onClick, [modalProps, onClick]);
  const _children = React.useMemo(() => !!text?text:children, [text, children]);


  return !!confirm ?
    <Popconfirm title={confirm} onConfirm={_onClick} okText="确认" cancelText="取消" disabled={disabled}>
      <AntdButton {...restProps} disabled={disabled}>{_children}</AntdButton>
    </Popconfirm> :
    <AntdButton {...restProps} disabled={disabled} onClick={_onClick}>
      {_children}
    </AntdButton>;
}