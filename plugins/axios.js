import ResponseFunctions from "@/utils/api/responseFunctions";

export default function ({ $axios, $toast, $auth }) {

  $axios.onResponse(response => {
    _onSuccess(response)
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
    // Token is no longer valid: drop the session once, watchLoggedIn redirects to /login
    if (e.response?.status === 401) {
      if ($auth.loggedIn) {
        $auth.reset();
      }
      throw { reason: null, validationErrors: {}, response: e.response };
    }
    const reason = ResponseFunctions.retrieveSingleValidationErrorMessage(e);
    const validationErrors = ResponseFunctions.retrieveValidationErrorsMap(e, true);
    const isReportableError = ResponseFunctions.retrieveIsReportable(e);
    if (reason && isReportableError) {
      $toast.error(reason);
    }
    throw {
      reason,
      validationErrors,
      response: e.response
    }
  })
}
