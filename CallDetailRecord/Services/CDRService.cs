using CallDetailRecord.Models;
using System.Reflection;
using System.Text.Json;

namespace CallDetailRecord.Services
{
    public class CDRService
    {
        public string ParseCDRJson()
        {
            string filePath = Path.Combine("Resources", "cdrs.json");

            string jsonString = File.ReadAllText(filePath);

            List<CDRModel> cdrs = JsonSerializer.Deserialize<List<CDRModel>>(jsonString);
            List<string> result = new List<string>();

            result.Add("Top 3 most active Callers:");

            //1
            var top3Callers = cdrs.GroupBy(cdr => cdr.Caller).OrderByDescending(group => group.Count()).Take(3).Select(group => new
            {
                Number = group.Key,
                TotalCalls = group.Count()
            }).ToList();
            foreach (var topCallerItem in top3Callers)
            {
                result.Add($"{topCallerItem.Number}: {topCallerItem.TotalCalls} calls");
            }

            result.Add("\n");

            //2
            var topCaller = top3Callers.First();
            var totalDurationToTopCaller = cdrs.Where(cdr => cdr.Receiver == topCaller.Number).Sum(cdr => cdr.Duration);
            result.Add($"Total Duration of Calls to {topCaller.Number}: {totalDurationToTopCaller} seconds");


            //3
            var totalUniqNumbers = cdrs.Select(cdr => cdr.Caller).Union(cdrs.Select(cdr => cdr.Receiver)).Distinct().Count();
            result.Add($"Total Unique Phone Numbers: {totalUniqNumbers}");

            return String.Join( "\n", result );
        }
    }
}
