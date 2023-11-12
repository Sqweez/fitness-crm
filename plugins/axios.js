import ResponseFunctions from "@/utils/api/responseFunctions";

export default function ({ $axios, $toast }) {

  $axios.onRequest(config => {
    config.metadata = { 'request-startTime': new Date().getTime() }
    return config;
  })

  $axios.onResponse(response => {
    const start = response.config.metadata['request-startTime']
    const end = new Date().getTime()
    const duration = end - start
    response.metadata = {
      requestStartTime: start,
      requestEndTime: end,
      requestDuration: duration
    }
    if (
      true
      /*process.env.DEBUG_MODE !== undefined &&
      process.env.DEBUG_MODE &&
      process.client*/
    ) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('API response url: api/' + response.config.url)
      // eslint-disable-next-line no-console
      console.log(response)
      // eslint-disable-next-line no-console
      //console.trace()
      // eslint-disable-next-line no-console
      console.groupEnd()
      _onSuccess(response)
    }
  })

  function _onSuccess(response) {
    if (response.status === 200 && ResponseFunctions.retrieveIsReportable(response)) {
      const message = ResponseFunctions.retrieveSuccessMessage(response);
      const isReportable = ResponseFunctions.retrieveIsReportable(response);
      if (message && isReportable) {
        $toast.success(message);
      }
    }
  }

  $axios.onError(e => {
    const reason = ResponseFunctions.retrieveSingleValidationErrorMessage(e);
    const validationErrors = ResponseFunctions.retrieveValidationErrorsMap(e, true);
    const isReportableError = ResponseFunctions.retrieveIsReportable(e);
    if (reason && isReportableError) {
      $toast.error(reason);
    }
    throw {
      reason,
      validationErrors
    }
  })
}
