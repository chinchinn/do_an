﻿using server.enums;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace server.ViewModel
{
    public class ProviderViewModel
    {
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [DefaultValue(ActionStatus.Display)]
        public ActionStatus status { get; set; }

        public string phoneNumber { get; set; }

        public string address { get; set; }

        public string code { get; set; }

        public string email { get; set; }
    }
}
