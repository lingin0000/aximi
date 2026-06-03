import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './login.scss';

export default function LoginPage() {
  function handleWechatLogin() {
    Taro.showToast({ title: '微信登录（开发中）', icon: 'none' });
  }

  return (
    <View className="page">
      <View className="brand">
        <Text className="brand-title">半句</Text>
        <Text className="brand-desc">登录后享受完整功能</Text>
      </View>

      <View className="login-card">
        <View className="wechat-btn" onClick={handleWechatLogin}>
          <Text className="wechat-btn-text">微信一键登录</Text>
        </View>
        <Text className="login-tip">登录即表示同意《用户协议》和《隐私政策》</Text>
      </View>
    </View>
  );
}
