using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using SeikaCenter;


namespace Voice
{
    [DataContract]
    class SeikaData
    {
        [DataMember]
        public Dictionary<string, SeikaStruct> Data;

        public SeikaData()
        {
            Data = new Dictionary<string, SeikaStruct>();
            foreach (KeyValuePair<int, string> kvp in SeikaConnect.Instance().scc.AvatorList)
            {
                int id = kvp.Key;
                string name = kvp.Value;
                //Console.WriteLine($"-------------------------------------------------------");
                //Console.WriteLine($"{id}:{name}");
                Data.Add(name, new SeikaStruct(name, id));
                
            }
        }
    }

    [DataContract]
    class SeikaStruct
    {
        [DataMember]
        public string name;
        [DataMember]
        public int cid;

        [DataContract]
        public struct Pram {
            [DataMember]
            public decimal value;
            [DataMember]
            public decimal max;
            [DataMember]
            public decimal min;
            [DataMember]
            public decimal step;

            public Pram(decimal _value, decimal _max, decimal _min, decimal _step)
            {
                value = _value;
                max = _max;
                min = _min;
                step = _step;
            }
        }
        [DataMember]
        public Dictionary<string, Pram> parameter;

        public SeikaStruct(string _name,int _cid)
        {
            this.name = _name;
            this.cid = _cid;
            parameter = new Dictionary<string, Pram>();

            Dictionary<string, decimal>  parameterList = new Dictionary<string, decimal>();
            List<string> pramName = new List<string>();
            foreach (KeyValuePair<string, decimal> kvp in SeikaConnect.Instance().scc.GetAvatorParams_current(cid))
            {

                string pram = kvp.Key;
                decimal value = kvp.Value;
                parameterList.Add(pram, value);
                if(Regex.IsMatch(pram, ".*_value$"))
                {
                    string[] vs = { "_value" };
                    string name = pram.Split(vs, StringSplitOptions.None)[0];
                    pramName.Add(name);
                    //Console.WriteLine(@"あたり:"+name);
                }
                //Console.WriteLine($"{pram}:{value}");
            }
            foreach (string name in pramName)
            {
                decimal value = parameterList[name+ "_value"];
                decimal max = parameterList[name + "_value_max"];
                decimal min = parameterList[name + "_value_min"];
                decimal step = parameterList[name + "_value_step"];
                parameter.Add( name,new Pram(value, max, min, step));
            }
        }
    }
}
