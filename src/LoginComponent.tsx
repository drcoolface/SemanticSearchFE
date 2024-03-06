import React from "react";
import {
  Row,
  Col,
  Layout as AntdLayout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";


const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL

export interface ILoginForm {
  username: string;
  password: string;
}

 const LoginComponent: React.FC = () => {
  const [form] = Form.useForm<ILoginForm>();
  const navigate = useNavigate();

  const CardTitle = (
    
    <Title level={2} className="title" >
      Sign in for usage
    </Title>
    
  );

  const login = async (values:ILoginForm) =>{

    try {
      const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(values),

      });
      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.detail || 'Login failed');     
       }
  
      const data = await response.json();
      // Assuming your backend returns an access token on successful login
      const { access_token } = data;
  
      // Store the token for future requests
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('username', values.username);

  
      // Redirect or update UI upon successful login
      navigate('/search');
      message.success('Login successful:');
     // Reset the rating submission flag for the new search
    } catch (error) {
      message.error('Error logging in:', error);
    }

  }

  return (
    <AntdLayout className="layout">
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22}>
          <div className="container">
            <Card title={CardTitle} headStyle={{ borderBottom: 0 }}>
              <Form<ILoginForm>
                layout="vertical"
                form={form}
                onFinish={(values) => {
                  login(values);
                }}
                requiredMark={true}
                initialValues={{
                  remember: false,
                }}
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                  style={{ marginBottom: "12px" }}
                >
                  <Input type="password" placeholder="" size="large" />
                </Form.Item>

                <Button type="primary" size="large" htmlType="submit" block>
                  Sign in
                </Button>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </AntdLayout>
  );
};


export default LoginComponent