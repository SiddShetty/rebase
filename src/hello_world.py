from http import HTTPStatus
import simplejson

from lambdas.tracing import init_tracing, handler_wrapper
from lambdas import json_logger, log_uncaught_exceptions


logger = json_logger()
trace = init_tracing("adam")  # pylint: disable=invalid-name


@handler_wrapper
@log_uncaught_exceptions(logger)
def handler(event, _):
    logger.info("Got event", extra={"event": event})
    return "Hello"


@handler_wrapper
@log_uncaught_exceptions(logger)
def api_handler(event, _):
    logger.info("Got api event", extra={"event": event})
    body = {"ctx": trace.marshal_trace_context()}
    return {
        "headers": {"access-control-allow-origin": "*"},
        "body": simplejson.dumps(body),
        "statusCode": HTTPStatus.OK,
    }
