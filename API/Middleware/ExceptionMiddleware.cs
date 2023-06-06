using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, 
        IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;

        }
        //framework expects this invokeAsync as it is going to tell what will happen next.
        //middleware goes to one bit of middleware to next bit of middleware always calling next(RequestDelegate).
        
        //HttpContext gives access to http request.
        public async Task InvokeAsync(HttpContext context)
        {
           try
           {
                await _next(context);
           } 
           catch(Exception ex)
           {
            _logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode=(int)HttpStatusCode.InternalServerError;

            
            var response = _env.IsDevelopment()
            //if we are in development mode run this command
            ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
            //else run this command
            :new  ApiException(context.Response.StatusCode, ex.Message, "Internal server error");
           
           var options = new JsonSerializerOptions{PropertyNamingPolicy=JsonNamingPolicy.CamelCase};

           var json = JsonSerializer.Serialize(response, options);

           await context.Response.WriteAsync(json);
           }
        }
    }
}