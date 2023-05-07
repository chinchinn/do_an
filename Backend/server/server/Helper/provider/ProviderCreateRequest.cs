using server.enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helper.provider
{
    public class ProviderCreateRequest
    {
        public string name { get; set; }
        
        public ActionStatus status { get; set; }
        public string phoneNumber { get; set; }

        public string address { get; set; }

        public string code { get; set; }

        public string email { get; set; }
    }
}
