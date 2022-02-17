import React, { useState, useEffect, useRef } from 'react'
import Layout from '../../components/Layout';
import PrivacyPage from '../PrivacyPage'
import ServiceAgreementPage from '../ServiceAgreementPage'
import { signup, getIDCheck } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './style.css';
import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';
import icon_check from '../../image/drawable-xxxhdpi/icon_check.png';
import email_enhang from '../../image/drawable-xxxhdpi/email_enhang.png';

/**
* @author
* @function RegisterPage
**/

const RegisterPage = (props) => {
    
    const major_items = [
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

    const mbti_items = [
        'ENFJ', 'ESFJ', 'ENTJ', 'ESTJ', 'ENFP', 'ESFP', 'ENTP', 'ESTP',
        'INFJ', 'ISFJ', 'INTJ', 'ISTJ', 'INFP', 'ISFP', 'INTP', 'ISTP', 
    ];

    const [accountCreated, setAccountCreated] = useState(false);
    /* 사용자가 입력한 글자로 시작하는 전공을 담아두는 배열 */
    const [majorSuggestionsList, setMajorSuggestions] = useState([]);
    /* 사용자가 입력한 글자로 시작하는 mbti를 담아두는 배열 */
    const [mbtiSuggestionsList, setMbtiSuggestions] = useState([]);
    // 패스워드,아이디 체크
    const [pwValid, setPwValid] = useState(false);
    const [pwMatch, setPwMatch] = useState(false);
    const [idValid, setIdValid] = useState('uncheck');
    // MBTI, 전공 체크
    const [mbtiValid, setMbtiValid] = useState(false);
    const [majorValid, setMajorValid] = useState(false);
    // 약관 팝업
    const [privacy, setPrivacy] = useState(false);
    const [service, setService] = useState(false);

    // 페이지 넘기기
    const [secondPage, setSecondPage] = useState(false);
    
    // 버튼 활성화
    const [nextBtn, setNextBtn] = useState(false);
    const [emailBtn, setEmailtBtn] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email_name: '',
        email_address: '이메일 선택',
        password: '',
        re_password: '',
        name: '',
        major: '',
        student_id: '',
        mbti: '',
        image: null,
        agreement: ''
    });
    
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);

    // useRef로 태그 스타일 조정
    const idValidation = useRef(null);
    const pwValidation = useRef(null);
    const re_pwValidation = useRef(null);
    const icon_pwValidation = useRef(null);
    const agreeRef = useRef(null);
    const mbtiValidation = useRef(null);
    const majorValidation = useRef(null);

    useEffect(() => {
        dispatch(getIDCheck());
    }, [])

    const { username, email_name, email_address, password, re_password, name, major, student_id, mbti, image, agreement } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    /* 사용자가 전공을 입력하는 동안 실행되는 함수 */
    const onMajorChange = e => {
        e.preventDefault();
        const value = e.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = major_items.sort().filter(v => regex.test(v));

            // 전공을 올바르게 입력한 경우에만 majorValid = true
            const isValid = major_items.filter(major => major === value);
            if (isValid.length > 0) {
                setMajorValid(true);
                majorValidation.current.textContent = "";
            }
        }
        setMajorSuggestions(suggestions);
        setFormData({ ...formData, [e.target.name]: value });
    }

    const onMajorFocusOut = e => {
        e.preventDefault();
        const value = e.target.value;
        const isValid = major_items.filter(major => major === value);
        if (isValid.length === 0) {
            setMajorValid(false);
            majorValidation.current.textContent = "정확한 전공명을 입력해주세요";
        }
    }

    /* 사용자가 MBTI를 입력하는동안 실행되는 함수 */
    const onMbtiChange = e => {
        e.preventDefault();
        const value = e.target.value.toUpperCase();
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = mbti_items.sort().filter(v => regex.test(v));
        }
        // MBTI 올바르게 입력한 경우에만 mbtiValid = true
        if (value.length === 4) {
            const isValid = mbti_items.filter(mbti => mbti === value);
            if (isValid.length > 0) {
                setMbtiValid(true);
                mbtiValidation.current.textContent = "";
            }
        }
        else{
            setMbtiValid(false);
        }
        setMbtiSuggestions(suggestions);
        setFormData({ ...formData, [e.target.name]: value });
    }

    const onMbtiFocusOut = e => {
        e.preventDefault();
        const value = e.target.value.toUpperCase();
        const isValid = mbti_items.filter(mbti => mbti === value);
        // MBTI input 칸이 focus out 되었을 때, 정확한 전공명이 아닐 경우 경고 메시지 
        if (isValid.length === 0) {
            setMbtiValid(false);
            mbtiValidation.current.textContent = "MBTI를 올바르게 입력해주세요";
        }
    }

    const majorSuggestionSelected = (value) => {
        setFormData({...formData, major: value});
        setMajorSuggestions([]);
        setMajorValid(true);
        majorValidation.current.textContent = "";
    }

    const mbtiSuggestionSelected = (value) => {
        setFormData({...formData, mbti: value});
        setMbtiSuggestions([]);
        setMbtiValid(true);
        mbtiValidation.current.textContent = "";
    }

    const majorRenderSuggestions = () => {
        const suggestions = majorSuggestionsList;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick={e => majorSuggestionSelected(item)}>{item}</li>)}
            </ul>
        )
    }

    const mbtiRenderSuggestions = () => {
        const suggestions = mbtiSuggestionsList;
        
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick={e => mbtiSuggestionSelected(item)}>{item}</li>)}
            </ul>
        )
    }

    /* 사용자가 ID를 입력하는동안 실행되는 함수 */
    const onIDChange = e => {
        const username = e.target.value;
        setFormData({ ...formData, [e.target.name]: username });
        setIdValid('uncheck');
        idValidation.current.textContent = '아이디 중복 확인해주세요';
    }

    /* ID 중복 확인 */
    const idCheck = (e) => {
        e.preventDefault();
        if (username && user.users.length > 0) {
            let pass = true;
            user.users.map((user) => {
                if (username === user.username) {
                    pass = false;
                    if (idValid) {
                        setIdValid(false);
                        idValidation.current.textContent = '아이디가 중복됩니다'
                    }
                    return;
                }
            })
            if (pass) {
                if (!idValid || idValid === 'uncheck') {
                    setIdValid(true);
                }
                idValidation.current.textContent = '사용 가능한 아이디입니다';
            }
        }
    }

     //비밀번호 입력하는 동안 실행되는 함수
    const onPWChange = e => {
        e.preventDefault();
        const password = e.target.value;

        // 비밀번호 일치 여부
        if (!password || !re_password) {
            setPwMatch(false);
            re_pwValidation.current.textContent = '';
            icon_pwValidation.current.style.display = 'none';
        } else if (password === re_password) {
            setPwMatch(true);
            re_pwValidation.current.textContent = '비밀번호가 일치합니다';
            re_pwValidation.current.style.color = 'rgb(78, 194, 86)';
            icon_pwValidation.current.style.display = 'initial';
        } else {
            setPwMatch(false);
            re_pwValidation.current.textContent = '비밀번호가 일치하지 않습니다';
            re_pwValidation.current.style.color = 'rgb(251, 13, 21)';
            icon_pwValidation.current.style.display = 'none';
        }

        //길이 8 이상, 영어, 숫자, 특수문자 포함
        if (password.length < 8 || !(password.match(/[a-z]/) || password.match(/[A-Z]/))
        || !password.match(/\d/) || !password.match(/[~!@#$%^&*()_+|<>?:{}]/)) {
            setPwValid(false);
            pwValidation.current.textContent = '8자 이상 + 영어 + 숫자 + 특수문자 조합';
        }
        else {
            setPwValid(true);
            pwValidation.current.textContent = '사용 가능한 비밀번호입니다';
        }
        setFormData({ ...formData, [e.target.name]: password });
    }
    
    //비밀번호 재입력하는동안 실행되는 함수
    const onConfirmChange = e => {
        e.preventDefault();
        const confirmValue = e.target.value;

        if (!password || !confirmValue) {
            setPwMatch(false);
            re_pwValidation.current.textContent = '';
            icon_pwValidation.current.style.display = 'none';
        } else if (password === confirmValue) {
            setPwMatch(true);
            re_pwValidation.current.textContent = '비밀번호가 일치합니다';
            re_pwValidation.current.style.color = 'rgb(78, 194, 86)';
            icon_pwValidation.current.style.display = 'initial';
        } else {
            setPwMatch(false);
            re_pwValidation.current.textContent = '비밀번호가 일치하지 않습니다';
            re_pwValidation.current.style.color = 'rgb(251, 13, 21)';
            icon_pwValidation.current.style.display = 'none';
        }
        setFormData({ ...formData, [e.target.name]: confirmValue });
    }

    const onAgreeChange = () => {
        setFormData({ ...formData, ['agreement']: agreeRef.current.checked });
    }

    // 다음 버튼 활성화
    if (
        !username||idValid === 'uncheck'||!idValid
        ||!pwMatch||!pwValid
        ||!mbtiValid
        ||!name
        ||!major||!majorValid
        ||!student_id||student_id.length !== 10
    )
    {
        if (nextBtn) {
            setNextBtn(false);
        }
    } 
    else 
    {
        if (!nextBtn) {
            setNextBtn(true);
        }
    }
    
    // 이메일 인증 버튼 활성화
    if (!agreement||!email_name||email_address==='이메일 선택')
    {
        if (emailBtn) {
            setEmailtBtn(false);
        }
    } 
    else 
    {
        if (!emailBtn) {
            setEmailtBtn(true);
        }
    }

    // 다음 페이지 이동
    const nextPage = (e) => {
        e.preventDefault();

        setSecondPage(true);
    }

    // 최종 회원 가입
    const registerUser = (e) => {

        e.preventDefault();

        const email = email_name + email_address;

        const user = {
            username, email, password, re_password, name, major, student_id, mbti, image, agreement
        }

        dispatch(signup(user))
        .then(() => {
        setAccountCreated(true);
        })
        .catch((error) => {
            console.log(error)
        })

    }

    // 개인정보처리방침 열기
    const openPrivacy = () => {
        setPrivacy(true);
    }
    // 개인정보처리방침 닫기
    const closePrivacy = () => {
        setPrivacy(false);
    }
    // 이용약관 열기
    const openService = () => {
        setService(true);
    }
    // 이용약관 닫기
    const closeService = () => {
        setService(false);
    }

    if(auth.authenticated){
        return <Redirect to='/' />
    }

    if (accountCreated) {
        return <Redirect to = '/guide' /> 
    }

    return(
        <Layout>
            <div className="register_content">
                <div className="register_header">
                    <div className="upload_hleft">회원가입</div>
                    {/* <img src={icon_close} style={{verticalAlign: "middle", width: "14px", height: "14px"}} /> */}
                </div>
                <form onSubmit={e => registerUser(e)}>
                    {
                        !secondPage 
                        ?
                        <div>
                            {/* 회원가입 페이지 */}
                            <div className="register_title">
                                <h2>아이디*</h2>
                            </div>
                            <div id="register_email">
                                <div id="register_ID">
                                    <span className="register_box">
                                        <input 
                                            type="text" 
                                            className="register_int" 
                                            maxlength="20" 
                                            placeholder="아이디"
                                            name='username'
                                            value={username}
                                            onChange={e => onIDChange(e)}
                                        />
                                    </span>
                                </div>
                            </div>
                            <div id="register_emailtype">
                                <span id="register_confirm">
                                    <a href=""><button onClick={e => idCheck(e)}>아이디 중복확인</button></a>
                                </span>
                                <span className="register_notice" ref={idValidation}></span>
                            </div>
                            <div className="register_title">
                                <h2>비밀번호*</h2>
                            </div>
                            <div className="register_text">
                                <div id="register_password">
                                    <div className="register_box">
                                        <input 
                                            type="password" 
                                            className="register_int" 
                                            maxlength="20" 
                                            placeholder="비밀번호"
                                            name='password'
                                            value={password}
                                            onChange={e => onPWChange(e)}
                                        />
                                    </div>
                                    <div className="register_passwordCheck" ref={pwValidation}>8자 이상 + 영어 + 숫자 + 특수문자 조합</div>
                                </div>
                                <div id="register_passwordcheck">
                                    <div className="register_box">
                                        <input 
                                            type="password" 
                                            className="register_int" 
                                            maxlength="20" 
                                            placeholder="비밀번호 확인"
                                            name='re_password'
                                            value={re_password}
                                            onChange={e => onConfirmChange(e)}
                                        />
                                        <img src={icon_check} ref={icon_pwValidation} style={{display: "none"}} />
                                    </div>
                                    <div className="register_passwordCheck" style={{color: "rgb(78, 194, 86)"}} ref={re_pwValidation}></div>
                                </div>
                            </div>
                            <div className="register_title">
                                <h2>MBTI</h2>
                            </div>
                            <div className="register_text">
                                <div id="register_name">
                                    <div className="register_box">
                                        <input 
                                            type="text" 
                                            className="register_int" 
                                            maxlength="4" 
                                            placeholder="MBTI 입력"
                                            name='mbti'
                                            value={mbti}
                                            onBlur={e => onMbtiFocusOut(e)}
                                            onChange={e => onMbtiChange(e)}
                                        />
                                    </div>
                                    <div className="register_mbtiCheck" ref={mbtiValidation}></div>
                                </div>
                            </div>
                            <div className='register_autoCompleteText'>
                                {mbtiRenderSuggestions()}
                            </div>
                            <div className="register_title">
                                <h2>이름*</h2>
                            </div>
                            <div className="register_text">
                                <div id="register_name">
                                    <div className="register_box">
                                        <input 
                                            type="text" 
                                            className="register_int" 
                                            maxlength="20" 
                                            placeholder="이름"
                                            name='name'
                                            value={name}
                                            onChange={e => onChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="register_title">
                                <h2>학부/학과*</h2>
                            </div>
                            <div className="register_text">
                                <div id="register_name">
                                    <div className="register_box">
                                        <input 
                                            type="text" 
                                            className="register_int"
                                            placeholder="학부/학과 입력"
                                            name='major'
                                            value={major}
                                            onBlur={e => onMajorFocusOut(e)}
                                            onChange={e => onMajorChange(e)}
                                        />
                                    </div>
                                    <div className="register_majorCheck" ref={majorValidation}></div>
                                </div>
                            </div>
                            <div className='register_autoCompleteText'>
                                {majorRenderSuggestions()}
                            </div>
                            <div className="register_title">
                                <h2>학번 (10자리)*</h2>
                            </div>
                            <div className="register_text">
                                <div id="register_studentnumber">
                                    <div className="register_box">
                                        <input 
                                            type="text" 
                                            className="register_int" 
                                            maxlength="10" 
                                            placeholder="학번"
                                            name='student_id'
                                            value={student_id}
                                            onChange={e => onChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="register_btn">
                                {
                                    nextBtn ?
                                    <button className='register_activate' onClick={e => nextPage(e)}>다음</button>
                                    :
                                    <button className='register_deactivate' disabled>다음</button>
                                }
                                
                            </div>
                        </div>
                        :
                        <div>
                            {/* 이메일 인증 페이지 */}
                            <div className="certification_logo">
                                <img src={email_enhang} width="152px" />
                            </div>
                            <div className="certification_title">
                                <h1>성균관대학교 인증</h1>
                            </div>
                            <div className="certification_text">
                                <p>
                                    스꾸친(SKKU_CHIN)은 
                                    <br/>
                                    <br/>
                                    <span style={{backgroundColor: "#ffd0007c", color: "black"}}>
                                        성균관대학교 전용 밥약 매칭 서비스
                                    </span>
                                    를 제공합니다.
                                    <br/><br/>
                                    원할한 서비스 이용을 위해
                                    <br/>
                                    <br/>
                                    성균관대학교 이메일 인증을 완료해주세요.
                                </p>
                            </div>
                            <div id="certification_email">
                                <div id="certification_ID">
                                    <span className="certification_box">
                                        <input 
                                            type="text"
                                            name='email_name'
                                            value={email_name}
                                            className="certification_int" 
                                            maxlength="20" 
                                            placeholder="킹고 이메일 주소"
                                            onChange={e => onChange(e)}
                                        />
                                    </span>
                                </div>
                                <div id="certification_emailtype">
                                    <span className="certification_box">
                                        <select 
                                            className="certification_sel" 
                                            name='email_address'
                                            value={email_address}
                                            onChange={e => onChange(e)}
                                        >
                                            <option value="이메일 선택">이메일 선택</option>
                                            <option value="@skku.edu">@ skku.edu</option>
                                            <option value="@g.skku.edu">@ g.skku.edu</option>
                                        </select>
                                    </span>
                                </div>
                            </div>
                            <div className="certification_checkBox">
                                <input 
                                    type="checkbox" 
                                    id="cert_checkbox"
                                    className="input-text"
                                    name='agreement'
                                    ref={agreeRef}
                                    onClick={onAgreeChange}
                                />
                                <div className='checkBox_info'>
                                    <span onClick={openPrivacy}><u><strong>개인정보처리방침</strong></u></span> 및 <span onClick={openService}><u><strong>이용약관</strong></u></span>에 동의합니다.
                                </div>
                            </div>
                            <div className="certification_explain">
                                <p>
                                    ※ 본인 이메일 인증을 하지 않은 경우, 
                                    <br/><br/>
                                    서비스 이용에 어려움이 있을 수 있습니다.
                                </p>
                            </div>
                            <div className="certification_btn">
                                <div className="certification_btn2">
                                    {
                                        emailBtn ?
                                        <button className='certification_activate' onClick={registerUser}>이메일 인증하기</button>
                                        :
                                        <button className='certification_deactivate' disabled>이메일 인증하기</button>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </form>
            </div>
            { privacy ? <PrivacyPage windowOff={closePrivacy} /> : null }
            { service ? <ServiceAgreementPage windowOff={closeService} /> : null }
        </Layout>
    )
}

export default RegisterPage;