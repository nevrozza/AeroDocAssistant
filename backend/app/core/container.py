from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.core.chat import ChatService
    from app.core.doc_manager import DocumentManager


class Container:

    chat_service: 'ChatService'
    doc_manager: 'DocumentManager'

    @classmethod
    def build(cls):
        from app.core import search, config
        from app.core.doc_manager import DocumentManager
        from app.core.chat import ChatService

        search.setup()

        cls.doc_manager = DocumentManager(config.DATA_FOLDER)
        cls.doc_manager.load()

        cls.chat_service = ChatService()
