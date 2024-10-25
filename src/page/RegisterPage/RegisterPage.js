import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";  //리덕스
import { useNavigate } from "react-router";

import "./style/register.style.css";

import { registerUser } from "../../features/user/userSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();  //리덕스 dispatch를 통해 사용자가 입력한데이터를 registerUser 액션으로 전달하여 서버와 통신
  const [formData, setFormData] = useState({     //사용자가 입력한 이메일, 이름, 비번, 비번확인, 약관 여부확인
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");  //비번과 비번확인이 맞지 않으면 오류
  const [policyError, setPolicyError] = useState(false);   // 이용약관 동의체크 안하면 오류
  const { registrationError } = useSelector((state) => state.user); //useSelector 전역 상태에서 회원가입중 오류 발생하면 오류 메세지 표시

  const register = (event) => {   //회원가입 버튼을 누르면 실행됨
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;
    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }
    if (!policy) {   //이용약관에 동의하지 않으면 setPolicyError
      setPolicyError(true);
      return;
    }
    setPasswordError(""); //비밀번호 확인이 정상일 경우 ""로 오류를 지움
    setPolicyError(false); // 변수자체가 Error라 true면 미체크, false면 체크된 상태이다
    dispatch(registerUser({ name, email, password, navigate })); //성공하면 navigate로 페이지 이동
  }; //**registerUser는 회원가입 API 요청을 보내는 액션으로 사용자 정보를 서보에 보내 회원가입을 처리하게 한다.

  const handleChange = (event) => { //사용자가 입력한 값을 formData에 업데이트하는 역할
    event.preventDefault(); // 체크박스 체크, 데이터 입력간 페이지가 변하지 않고 액션만 취할수 있게 다른 동작을 막는다.
    let { id, value, type, checked } = event.target; // evet.target은 이벤트가 발생한 HTML 요소를 참조한다. 
   //id : 입력 필드 고유 ID (confirmPassword, email, password, plicy 등)
   //value : 입력 필드에 입력된 값
   //type : 입력 필드의 유형 (checkbox, text,email,password,checkbox 등)
   //checked : 체크박스 선택여부 
   
    if (id === "confirmPassword" && passwordError) setPasswordError(""); //비밀번호 확인란에 새롭게 작성되면 기존 오류 호출된건 지워줌
    if (type === "checkbox") { //체크박스 동작 확인 왜냐면 value값이 아니라 checked로 별도로 속성을 사용하기 떄문에 별도 처리
      if (policyError) setPolicyError(false); //checkbox에 체크했는데 이전상태가 ture이면 false 상태로 체크상태로 변경한다.
      setFormData((prevState) => ({ ...prevState, [id]: checked }));  //체크박스의 상태를 업데이트한다. **prevState는 이전 formData 상태이다
                                    //prevState로 기존 form은 유지한상태에서 checked를 id로 가진 상태만 업데이트한다
    } else { //나머지 입력값은 value로 form을 업데이트
      setFormData({ ...formData, [id]: value }); //사용자가 이메일이나 비밀번호 등을 입력할 때마다 그 값이 formData 상태에 반영
    }
  };

  return (
    <Container className="register-area">  
       
       {/* 회원가입 중 에러가 발생한 경우 경고 메시지 표시 */}
      {registrationError && (
        <div>
          <Alert variant="danger" className="error-message">
            {registrationError}
          </Alert>
        </div>
      )}

            {/* 회원가입 폼 */}
      <Form onSubmit={register}>

           {/* 이메일 입력 필드 */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </Form.Group>
       
        {/* 이름 입력 필드 */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* 비밀번호 입력 필드 */}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* 비밀번호 확인 입력 필드 */}
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        
        {/* 약관 동의 체크박스 */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
        </Form.Group>

        {/* 회원가입 버튼 */}
        <Button variant="danger" type="submit">
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
