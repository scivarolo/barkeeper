using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace Barkeeper2.Helpers.Exceptions {
    public class JsonExceptionHandler {
        private readonly RequestDelegate _next;

        public JsonExceptionHandler(RequestDelegate next) {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IHostEnvironment environment) {
            try {
                await _next(context);
            } catch (Exception ex) {
                await HandleJsonException(context, environment, ex);
            }
        }

        private static Task HandleJsonException(HttpContext context, IHostEnvironment environment, Exception ex) {
            string result;
            var code = HttpStatusCode.InternalServerError;
            if (environment.IsDevelopment()) {
                var error = new {
                    error = ex.Message,
                    stack = ex.StackTrace,
                    innerException = ex.InnerException
                };
                result = JsonConvert.SerializeObject(error);
            } else {
                var error = new {
                    error = ex.Message
                };
                result = JsonConvert.SerializeObject(error);
            }
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}