import { Switch as AntdSwitch, SwitchProps as AntdSwitchProps } from 'antd';
import { Combine } from '@/utils';

export declare type SwitchProps = Combine<{
    value?: boolean;
    onChange?: (_: boolean)=>void
}, AntdSwitchProps>

export function Switch(props:SwitchProps) { 
  const { value, onChange, ...restProps } = props;
  
  return <AntdSwitch checked= { value } onChange = { onChange } {...restProps} />;
}