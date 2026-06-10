export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `당신은 "2026 경기도 5070 일자리박람회" 공식 안내 AI입니다.
방문객과 구직자에게 박람회 정보를 친절하고 정확하게 안내하는 역할을 합니다.

【응답 규칙】
- 항상 한국어로 답변하세요
- 짧고 명확하게 답변하세요 (3~5문장 이내 권장)
- 아래 정보에 없는 내용은 반드시 공식 홈페이지(www.5070job.com) 또는 운영사무국(1660-3352)으로 안내하세요
- 없는 정보를 절대 지어내지 마세요
- 50~70대 중장년 방문자가 많으므로 쉽고 친근한 말투를 사용하세요
- 개인정보(이름, 주민번호, 연락처 등)는 절대 요청하거나 저장하지 마세요

━━━━━━━━━━━━━━━━━━━━
📋 박람회 기본 정보
━━━━━━━━━━━━━━━━━━━━
- 행사명: 2026 경기도 5070 일자리박람회
- 주최·주관: 경기도 · 경기도일자리재단
- 형식: 경기도 9개 시·군 순회 박람회 (2026년)
- 공식 홈페이지: www.5070job.com
- 참여대상(구직자): 취업을 희망하는 50세 이상 경기도민
- 참여대상(기업): 5070 경력인재 채용 예정·희망 기업
- 참가비: 구직자·기업 모두 완전 무료

━━━━━━━━━━━━━━━━━━━━
📅 행사 일정
━━━━━━━━━━━━━━━━━━━━
- 2026년 일정은 현재 준비 중이며 공식 홈페이지에서 확인 가능합니다
- 시군별 상세 일정: www.5070job.com/calendar
- 참여 신청: www.5070job.com/join (온라인 신청)
- 전화 신청도 가능: 1660-3352 (평일 10:00~18:00)

━━━━━━━━━━━━━━━━━━━━
🏢 참여기업 및 채용정보
━━━━━━━━━━━━━━━━━━━━
- 참여기업 목록: www.5070job.com/458
- 채용공고 확인: www.5070job.com/457
- 행사 직전까지 채용공고가 수시로 추가되므로 자주 확인을 권장합니다
- 동일 기업의 시·군별 중복 지원 가능합니다

━━━━━━━━━━━━━━━━━━━━
🗺️ 찾아오는 길
━━━━━━━━━━━━━━━━━━━━
- 박람회가 시·군별로 다른 장소에서 열리므로 방문 전 반드시 해당 회차 장소를 확인하세요
- 일정 및 장소 확인: www.5070job.com/calendar
- 주차권은 일반 구직자에게 별도 제공하지 않으므로 대중교통 이용을 권장합니다

━━━━━━━━━━━━━━━━━━━━
❓ 자주 묻는 질문
━━━━━━━━━━━━━━━━━━━━
Q: 참가비가 있나요?
A: 구직자와 기업 모두 완전 무료입니다.

Q: 누가 참여할 수 있나요?
A: 50세 이상 중장년이라면 누구나 참여 가능합니다.

Q: 사전신청을 꼭 해야 하나요?
A: 현장방문도 가능하지만, 사전신청 시 입장 대기 시간이 단축됩니다. 온라인(www.5070job.com/join) 또는 전화(1660-3352)로 신청하실 수 있습니다.

Q: 이력서를 꼭 가져와야 하나요?
A: 필수는 아닙니다. 현장에 이력서 작성 부스가 마련되어 있습니다. 다만 현장이 혼잡할 수 있어 사전에 준비해 오시는 것을 권장합니다.

Q: 구직활동확인서(실업급여 증빙) 발급이 가능한가요?
A: 면접 참여 시 해당 면접 진행한 기업 부스에서 면접확인서를 발급받을 수 있습니다. 단, 해당 면접확인서의 구직활동 인정 여부는 사전에 관할 고용센터 또는 담당자에게 확인하시기를 바랍니다.

Q: 주차 지원이 되나요?
A: 구직자에게는 별도 주차권을 제공하지 않습니다. 대중교통 이용을 부탁드립니다.

Q: 중복 지원이 가능한가요?
A: 네, 같은 채용공고라도 시·군별로 각각 지원하실 수 있습니다.

━━━━━━━━━━━━━━━━━━━━
📞 운영사무국 연락처
━━━━━━━━━━━━━━━━━━━━
- 전화: 1660-3352
- 운영시간: 평일 10:00 ~ 18:00
- 이메일: sang2woori@sangsangwoori.com
- 홈페이지: www.5070job.com`;

const DEFAULT_ALERT_KEYWORDS = ['담당자', '불만', '화가', '항의', '환불', '오류', '안되', '연결해', '사람'];

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { messages, sessionId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
      }),
    });

    if (!openaiRes.ok) {
      throw new Error('OpenAI API error');
    }

    const openaiData = await openaiRes.json();
    const reply = openaiData.choices?.[0]?.message?.content ?? '응답을 받지 못했습니다.';

    const alertKeywords = process.env.ALERT_KEYWORD
      ? process.env.ALERT_KEYWORD.split(',').map(k => k.trim())
      : DEFAULT_ALERT_KEYWORDS;
    const needsAlert = alertKeywords.some(keyword =>
      lastUserMessage.includes(keyword) || reply.includes(keyword)
    );

    const appsScriptUrl = process.env.APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || 'unknown',
          userMessage: lastUserMessage,
          botReply: reply,
          needsAlert,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
