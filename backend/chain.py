from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from backend.prompts import CHEF_SYSTEM_PROMPT

# In-memory store: session_id -> list of messages (HumanMessage, AIMessage)
_session_histories: dict[str, list] = {}


def _get_history(session_id: str) -> list:
    if session_id not in _session_histories:
        _session_histories[session_id] = []
    return _session_histories[session_id]


def _build_human_message(message: str, image_base64: str | None, image_type: str | None) -> HumanMessage:
    """Build a text-only or image+text HumanMessage depending on whether an image was provided."""
    if image_base64 and image_type:
        return HumanMessage(content=[
            {"type": "image_url", "image_url": {"url": f"data:{image_type};base64,{image_base64}"}},
            {"type": "text", "text": message},
        ])
    return HumanMessage(content=message)


def chat(
    session_id: str,
    message: str,
    temperature: float,
    verbosity: str,
    image_base64: str | None = None,
    image_type: str | None = None,
) -> str:
    history = _get_history(session_id)
    system_text = CHEF_SYSTEM_PROMPT.format(verbosity=verbosity)
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=temperature)

    human_message = _build_human_message(message, image_base64, image_type)
    all_messages = [SystemMessage(content=system_text)] + history + [human_message]

    response = llm.invoke(all_messages)
    reply = response.content

    # Persist this turn so future requests remember the conversation
    history.append(human_message)
    history.append(AIMessage(content=reply))

    return reply
