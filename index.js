import React, { useState } from 'react'
import Layout from '../../components/Layout';
import { signup } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import logoImage from '../../img/SKKUsilLogo.png';
import passImage from '../../img/register/m_icon_pass.png';
import disabledImage from '../../img/register/m_icon_check_disable.png';
import './style.css';

/**
* @author
* @function RegisterPage
**/

const RegisterPage = (props) => {
  
    document.body.className='Register-body';

    const items = [
    '글로벌경영학과', '글로벌경제학과', '글로벌리더학과', '글로벌바이오메디컬공학과',
    '유학동양학과', '국어국문학과', '영어영문학과', '프랑스어문학과', '러시아어문학과',
    '중어중문학과', '독어독문학과', '한문학과', '사학과', '철학과', '문헌정보학과',
    '행정학과', '정치외교학과', '미디어커뮤니케이션학과', '사회학과', '사회복지학과',
    '심리학과', '소비자학과', '아동청소년학과', '경제학과', '통계학과',
    '생명과학과', '수학과', '물리학과', '화학과',
    '식품생명공학과', '바이오메카트로닉스학과', '융합생명공학과', '유전공학과',
    '화학공학/고분자시스템공학부', '고분자시스템공학과', '신소재공학부', '기계공학부', '건설환경공학부', '건축토목공학부', '조경학과', '시스템경영공학과', '건축학과', '나노공학과',
    '경영학과',
    '교육학과', '한문교육과', '수학교육과', '컴퓨터교육과',
    '미술학과', '무용학과', '디자인학과', '영상학과', '연기예술학과', '의상학과',
    '전자전기공학부', '반도체시스템공학과', '컴퓨터공학과', '소프트웨어학과',
    '약학과', '스포츠과학과', '의예과', '의학과',
    '인공지능융합전공', '데이터사이언스융합전공', '컬처앤테크놀로지융합전공', 
    '인문과학계열', '사회과학계열', '자연과학계열', '공학계열',
    ];

    const [accountCreated, setAccountCreated] = useState(false);
    /* 사용자가 입력한 글자로 시작하는 전공을 담아두는 배열 */
    const [suggestionsList, setSuggestions] = useState([]);

    const [pwValid, setPwValid] = useState(false);

    const [pwMatch, setPwMatch] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
    //   email_name: '',
    //   email_address: '@g.skku.edu',
        email: '',
        password: '',
        re_password: '',
        name: '',
        major: '',
        student_id: ''
    });
    
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    const { username, email, password, re_password, name, major, student_id } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    /* 사용자가 전공을 입력하는 동안 실행되는 함수 */
    const onMajorChange = e => {
        e.preventDefault();
        const value = e.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = items.sort().filter(v => regex.test(v));
        }
        setSuggestions(suggestions);
        setFormData({ ...formData, [e.target.name]: value });
    }


    const suggestionSelected = (value) => {
        setFormData({...formData, major: value});
        setSuggestions([]);
    }

    const renderSuggestions = () => {
        const suggestions = suggestionsList;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick={e => suggestionSelected(item)}>{item}</li>)}
            </ul>
        )
    }

    //비밀번호 입력하는 동안 실행되는 함수
    const onPWChange = e => {
        e.preventDefault();
        const password = e.target.value;

        //길이 8 이상, 영문 대 소문자, 숫자, 특수문자 포함
        if (password.length < 8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/)
        || !password.match(/\d/) || !password.match(/[~!@#$%^&*()_+|<>?:{}]/)) {
            setPwValid(false);
        }
        else {
            setPwValid(true);
        }
        setFormData({ ...formData, [e.target.name]: password });
    }

    //비밀번호 조건 만족시키지 못하면 오류 메시지 보여줌
    const renderCaution = () => {
        const valid = pwValid;
        const caution = "8자 이상 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
        if (valid || password === '') {
            return null;
        }
        return (
            <div className="pwValid_style">{caution}</div>
        )
    }

    //비밀번호 재입력하는동안 실행되는 함수
    const onConfirmChange = e => {
        e.preventDefault();
        const confirmValue = e.target.value;

        if (password === confirmValue) {
            setPwMatch(true);
        }
        else {
            setPwMatch(false);
        }
        setFormData({ ...formData, [e.target.name]: confirmValue });
    }

    //재입력한 비밀번호가 일치하지 않으면 오류 메시지 보여줌
    const renderConfirmCaution = () => {
        const valid = pwMatch;
        const caution = "비밀번호가 일치하지 않습니다.";
        if (valid || re_password === '') {
            return null;
        }
        return (
            <div className="pwValid_style">{caution}</div>
        )
    } 
    
    

    const registerUser = (e) => {

        e.preventDefault();

        // const email = email_name + email_address;

        const user = {
            username, email, password, re_password, name, major, student_id
        }

        dispatch(signup(user))
        .then(() => {
            // 비밀번호가 조건을 만족하고 re_password와 일치할 경우에만 계정 생성
            if (pwValid && pwMatch) {
                setAccountCreated(true);
            }
            
        })
        .catch((error) => {
            console.log(error)
        })
    }

    if(auth.authenticated){

        return <Redirect to={`/`} />
    }

    if (accountCreated) {

        return <Redirect to = '/login' />
    }

    return(
        <Layout>
            <div>
                <div className="Register-back">
                    <button onClick="history.back()"><i className="fa fa-chevron-left"></i></button>
                </div>
                <div className="Register-logo">
                    <img src={logoImage} />
                </div>
                <div id="wrapper">
                <form onSubmit={registerUser}>
                    {/* content */}
                    <div id="content">
                        {/* ID */}
                        <div>
                            <h3 className="Register-join_title"><label htmlFor="username">아이디</label></h3>
                            <span className="Register-box int_name">
                                <input 
                                    type="text" 
                                    id="username" 
                                    className="Register-int" 
                                    maxlength="20"
                                    name='username'
                                    value={username}
                                    onChange={e => onChange(e)}
                                    required
                                />
                            </span>
                        </div>
                        <div>
                            <h3 className="Register-join_title"><label htmlFor="username">이메일</label></h3>
                            <span className="Register-box int_name">
                                <input 
                                    type="text" 
                                    id="email" 
                                    className="Register-int" 
                                    maxlength="30"
                                    name='email'
                                    value={email}
                                    onChange={e => onChange(e)}
                                    required
                                />
                            </span>
                        </div>
                        {/* E-mail */}
                        {/* <div>
                            <h3 className="Register-join_title"><label htmlFor="Email">킹고 이메일 인증</label></h3>
                            <div id="Email_wrap"> */}
                                {/* E-mail ID */}
                                {/* <div id="Email_ID">
                                    <span className="Register-box">
                                        <input 
                                            type="text" 
                                            id="ID" 
                                            className="Register-int"
                                            placeholder="이메일 앞 주소" 
                                            name='email_name'
                                            value={email_name}
                                            onChange={e => onChange(e)}
                                            required
                                        />
                                    </span>
                                </div> */}
                                {/* E-mail Type */}
                                {/* <div id="Email_type">
                                    <span className="Register-box">
                                        <select 
                                            id="TYPE"
                                            className="Register-sel"
                                            name='email_address'
                                            value={email_address}
                                            onChange={e => onChange(e)}
                                            required
                                        >
                                            <option>선택</option>
                                            <option value="@g.skku.edu">@g.skku.edu</option>
                                        </select>
                                    </span>
                                </div>
                            </div>
                        </div> */}
                        {/* PW1 */}
                        <div>
                            <h3 className="Register-join_title"><label htmlFor="pswd1">비밀번호</label></h3>
                            <span className="Register-box int_pass">
                                <input 
                                    type='password'
                                    id="pswd1" 
                                    className="Register-int" 
                                    maxlength="20"
                                    minLength='6'
                                    name='password'
                                    value={password}
                                    onChange={e => onPWChange(e)}
                                    required
                                />
                                <img src={passImage} id="pswd1_img1" className="Register-pswdImg" />
                                {renderCaution()}
                            </span>
                        </div>
                        {/* PW Confirm */}
                        <div>
                            <h3 className="Register-join_title"><label htmlFor="pswd2">비밀번호 재확인</label></h3>
                            <span className="Register-box int_pass_check">
                                <input 
                                    type="password" 
                                    id="pswd2" 
                                    className="Register-int" 
                                    maxlength="20"
                                    minLength='6'
                                    name='re_password'
                                    value={re_password}
                                    onChange={e => onConfirmChange(e)}
                                    required
                                />
                                <img src={disabledImage} id="pswd2_img1" className="Register-pswdImg" />
                                {renderConfirmCaution()}
                            </span>
                        </div>
                        {/* NAME */}
                        <div>
                            <h3 className="Register-join_title"><label htmlFor="name">이름</label></h3>
                            <span className="Register-box int_name">
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="Register-int" 
                                    maxlength="20"
                                    name='name'
                                    value={name}
                                    onChange={e => onChange(e)}
                                    required
                                />
                            </span>
                        </div>
                        {/* MAJOR */}
                        <div>
                            <h3 className="Register-join_title"><label htmlFor="major">전공</label></h3>
                            {/* className = autoCompleteText 추가 */}
                            <span className="Register-box int_name autoCompleteText"> 
                                <input 
                                    type="text" 
                                    id="major" 
                                    className="Register-int" 
                                    maxlength="20"
                                    name='major'
                                    value={major}
                                    onChange={e => onMajorChange(e)}
                                    required
                                />
                                {renderSuggestions()}
                            </span>
                        </div>
                        {/* Student Number */}
                        <div>
                            <h3 className="Register-join_title"><label htmlFor="std_number">학번</label></h3>
                            <span className="Register-box int_name">
                                <input 
                                    type="text" 
                                    id="studentid" 
                                    className="Register-int" 
                                    maxlength="20"
                                    name='student_id'
                                    value={student_id}
                                    onChange={e => onChange(e)}
                                    required
                                />
                            </span>
                        </div>
                        {/* JOIN BTN */}
                        <div className="Register-btn_area">
                            <button type="submit" id="btnJoin">
                                <span>가입하기</span>
                            </button>
                        </div>
                    </div> 
                {/* content */}
                </form>
                </div> 
            {/* wrapper */}
            </div>
        </Layout>
    )

}

export default RegisterPage;