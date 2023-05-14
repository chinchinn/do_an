using server.enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helper.statistics
{
    public class RevenueStatisticsRequest
    {
        public DayOrMonth? option { get; set; }
        public int? month { get; set; }
        public int? year { get; set; }

        public DateTime? toDate { get; set; }
        public DateTime? fromDate { get; set; }

        public bool optionTime { get; set; }
    }
}
